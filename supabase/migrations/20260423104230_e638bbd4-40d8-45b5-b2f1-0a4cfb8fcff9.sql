-- =====================================================
-- ENUMS
-- =====================================================
create type public.app_role as enum ('admin', 'teacher', 'student');
create type public.student_status as enum ('active', 'on_leave', 'graduated');
create type public.course_status as enum ('open', 'full', 'waitlist', 'closed');
create type public.enrollment_status as enum ('active', 'waitlist', 'dropped', 'completed');
create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');

-- =====================================================
-- PROFILES
-- =====================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- =====================================================
-- USER ROLES (separate table — never on profiles)
-- =====================================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security-definer function — used by all role checks to avoid RLS recursion
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Convenience: is the caller staff (admin or teacher)?
create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('admin', 'teacher')
  )
$$;

-- =====================================================
-- STUDENTS
-- =====================================================
create table public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  student_code text not null unique,
  full_name text not null,
  email text not null unique,
  major text,
  year smallint check (year between 1 and 6),
  gpa numeric(3,2) check (gpa >= 0 and gpa <= 4.00),
  status public.student_status not null default 'active',
  attendance_percent numeric(5,2) default 100.00,
  avatar_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.students enable row level security;

create index idx_students_user_id on public.students(user_id);
create index idx_students_status on public.students(status);

-- =====================================================
-- COURSES
-- =====================================================
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  faculty text,
  department text,
  credits smallint not null default 3 check (credits between 1 and 8),
  schedule text,
  capacity int not null default 30 check (capacity > 0),
  status public.course_status not null default 'open',
  term text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create index idx_courses_status on public.courses(status);
create index idx_courses_department on public.courses(department);

-- =====================================================
-- ENROLLMENTS
-- =====================================================
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

alter table public.enrollments enable row level security;

create index idx_enrollments_student on public.enrollments(student_id);
create index idx_enrollments_course on public.enrollments(course_id);

-- =====================================================
-- GRADES
-- =====================================================
create table public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  assignment1 numeric(5,2) check (assignment1 between 0 and 100),
  assignment2 numeric(5,2) check (assignment2 between 0 and 100),
  midterm numeric(5,2) check (midterm between 0 and 100),
  final_exam numeric(5,2) check (final_exam between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, course_id)
);

alter table public.grades enable row level security;

create index idx_grades_student on public.grades(student_id);
create index idx_grades_course on public.grades(course_id);

-- =====================================================
-- ATTENDANCE
-- =====================================================
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  session_date date not null,
  session_number int,
  status public.attendance_status not null default 'present',
  note text,
  created_at timestamptz not null default now(),
  unique (student_id, course_id, session_date)
);

alter table public.attendance enable row level security;

create index idx_attendance_student on public.attendance(student_id);
create index idx_attendance_course on public.attendance(course_id);
create index idx_attendance_date on public.attendance(session_date);

-- =====================================================
-- TIMESTAMP TRIGGER
-- =====================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_students_updated_at before update on public.students
  for each row execute function public.set_updated_at();
create trigger set_courses_updated_at before update on public.courses
  for each row execute function public.set_updated_at();
create trigger set_grades_updated_at before update on public.grades
  for each row execute function public.set_updated_at();

-- =====================================================
-- AUTO-CREATE PROFILE + DEFAULT STUDENT ROLE ON SIGNUP
-- =====================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'student');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- PROFILES
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES (read your own; admins manage all)
create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert roles"
  on public.user_roles for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update roles"
  on public.user_roles for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete roles"
  on public.user_roles for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- STUDENTS
create policy "Staff can view all students"
  on public.students for select
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Students can view their own student record"
  on public.students for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Staff can insert students"
  on public.students for insert
  to authenticated
  with check (public.is_staff(auth.uid()));

create policy "Staff can update students"
  on public.students for update
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Admins can delete students"
  on public.students for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- COURSES (any signed-in user can browse the catalog)
create policy "Authenticated users can view courses"
  on public.courses for select
  to authenticated
  using (true);

create policy "Staff can insert courses"
  on public.courses for insert
  to authenticated
  with check (public.is_staff(auth.uid()));

create policy "Staff can update courses"
  on public.courses for update
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Admins can delete courses"
  on public.courses for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ENROLLMENTS
create policy "Staff can view all enrollments"
  on public.enrollments for select
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Students can view their own enrollments"
  on public.enrollments for select
  to authenticated
  using (
    exists (
      select 1 from public.students s
      where s.id = enrollments.student_id and s.user_id = auth.uid()
    )
  );

create policy "Staff can insert enrollments"
  on public.enrollments for insert
  to authenticated
  with check (public.is_staff(auth.uid()));

create policy "Staff can update enrollments"
  on public.enrollments for update
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Staff can delete enrollments"
  on public.enrollments for delete
  to authenticated
  using (public.is_staff(auth.uid()));

-- GRADES
create policy "Staff can view all grades"
  on public.grades for select
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Students can view their own grades"
  on public.grades for select
  to authenticated
  using (
    exists (
      select 1 from public.students s
      where s.id = grades.student_id and s.user_id = auth.uid()
    )
  );

create policy "Staff can insert grades"
  on public.grades for insert
  to authenticated
  with check (public.is_staff(auth.uid()));

create policy "Staff can update grades"
  on public.grades for update
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Staff can delete grades"
  on public.grades for delete
  to authenticated
  using (public.is_staff(auth.uid()));

-- ATTENDANCE
create policy "Staff can view all attendance"
  on public.attendance for select
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Students can view their own attendance"
  on public.attendance for select
  to authenticated
  using (
    exists (
      select 1 from public.students s
      where s.id = attendance.student_id and s.user_id = auth.uid()
    )
  );

create policy "Staff can insert attendance"
  on public.attendance for insert
  to authenticated
  with check (public.is_staff(auth.uid()));

create policy "Staff can update attendance"
  on public.attendance for update
  to authenticated
  using (public.is_staff(auth.uid()));

create policy "Staff can delete attendance"
  on public.attendance for delete
  to authenticated
  using (public.is_staff(auth.uid()));