import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EduPortal demo data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const group = await prisma.schoolGroup.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo School Network',
      subscriptionPlan: 'trial',
    },
  });

  const branch = await prisma.branch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      schoolGroupId: group.id,
      name: 'Main Campus',
      city: 'Lahore',
      address: 'Main Boulevard, Gulberg III',
      contact: '+92 300 1234567',
    },
  });

  const academicYear = await prisma.academicYear.upsert({
    where: { branchId_label: { branchId: branch.id, label: '2024-25' } },
    update: { isActive: true },
    create: {
      branchId: branch.id,
      label: '2024-25',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-06-30'),
      isActive: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.pk' },
    update: {},
    create: {
      email: 'admin@demo.pk',
      phone: '+923001111111',
      passwordHash,
      role: 'school_admin',
    },
  });

  await prisma.staff.upsert({
    where: { cnic: '35202-0000000-1' },
    update: {},
    create: {
      branchId: branch.id,
      userId: adminUser.id,
      role: 'admin',
      firstName: 'Ayesha',
      lastName: 'Khan',
      cnic: '35202-0000000-1',
      phone: '+923001111111',
      email: 'admin@demo.pk',
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@demo.pk' },
    update: {},
    create: {
      email: 'teacher@demo.pk',
      phone: '+923002222222',
      passwordHash,
      role: 'teacher',
    },
  });

  const teacher = await prisma.staff.upsert({
    where: { cnic: '35202-0000000-2' },
    update: {},
    create: {
      branchId: branch.id,
      userId: teacherUser.id,
      role: 'teacher',
      firstName: 'Imran',
      lastName: 'Ahmed',
      cnic: '35202-0000000-2',
      phone: '+923002222222',
      email: 'teacher@demo.pk',
    },
  });

  const classes = await Promise.all(
    [
      { name: 'Grade 6', numericOrder: 6 },
      { name: 'Grade 7', numericOrder: 7 },
      { name: 'Grade 8', numericOrder: 8 },
    ].map((c) =>
      prisma.class.upsert({
        where: { id: `00000000-0000-0000-0000-00000000${c.numericOrder.toString().padStart(4, '0')}` },
        update: {},
        create: {
          id: `00000000-0000-0000-0000-00000000${c.numericOrder.toString().padStart(4, '0')}`,
          branchId: branch.id,
          academicYearId: academicYear.id,
          name: c.name,
          numericOrder: c.numericOrder,
        },
      }),
    ),
  );

  const sections = await Promise.all(
    classes.flatMap((cls) =>
      ['A', 'B'].map((letter, i) =>
        prisma.section.upsert({
          where: {
            id: `10000000-0000-0000-0000-${cls.numericOrder.toString().padStart(4, '0')}${i.toString().padStart(4, '0')}`,
          },
          update: {},
          create: {
            id: `10000000-0000-0000-0000-${cls.numericOrder.toString().padStart(4, '0')}${i.toString().padStart(4, '0')}`,
            classId: cls.id,
            name: letter,
            capacity: 30,
          },
        }),
      ),
    ),
  );

  const subjectsSeed = [
    { name: 'Mathematics', code: 'MATH' },
    { name: 'English', code: 'ENG' },
    { name: 'Urdu', code: 'URD' },
    { name: 'Science', code: 'SCI' },
    { name: 'Islamiat', code: 'ISL' },
    { name: 'Pakistan Studies', code: 'PST' },
  ];
  const subjects = await Promise.all(
    subjectsSeed.map((s) =>
      prisma.subject.upsert({
        where: { branchId_code: { branchId: branch.id, code: s.code } },
        update: {},
        create: { ...s, branchId: branch.id },
      }),
    ),
  );

  for (const cls of classes) {
    for (const subj of subjects) {
      await prisma.classSubject.upsert({
        where: { classId_subjectId: { classId: cls.id, subjectId: subj.id } },
        update: { teacherId: teacher.id },
        create: { classId: cls.id, subjectId: subj.id, teacherId: teacher.id },
      });
    }
  }

  const sampleNames = [
    ['Hamza', 'Ali'], ['Zainab', 'Raza'], ['Bilal', 'Hussain'], ['Aisha', 'Malik'],
    ['Usman', 'Qureshi'], ['Fatima', 'Siddiqui'], ['Ahmed', 'Tariq'], ['Sara', 'Javed'],
    ['Hassan', 'Shah'], ['Maryam', 'Butt'], ['Omar', 'Farooq'], ['Nida', 'Shahid'],
  ];
  const sectionA = sections[0];
  for (let i = 0; i < sampleNames.length; i += 1) {
    const [first, last] = sampleNames[i];
    const student = await prisma.student.upsert({
      where: { id: `20000000-0000-0000-0000-${i.toString().padStart(12, '0')}` },
      update: {},
      create: {
        id: `20000000-0000-0000-0000-${i.toString().padStart(12, '0')}`,
        branchId: branch.id,
        firstName: first,
        lastName: last,
        rollNo: `S-${(i + 1).toString().padStart(3, '0')}`,
        gender: i % 2 === 0 ? 'male' : 'female',
      },
    });
    await prisma.enrollment.upsert({
      where: { studentId_academicYearId: { studentId: student.id, academicYearId: academicYear.id } },
      update: {},
      create: {
        studentId: student.id,
        sectionId: sectionA.id,
        academicYearId: academicYear.id,
        status: 'active',
      },
    });
  }

  await prisma.announcement.createMany({
    data: [
      {
        branchId: branch.id,
        postedById: adminUser.id,
        title: 'Welcome to EduPortal!',
        body: 'Our school is now live on EduPortal. Download the app and stay connected.',
        targetRoles: ['teacher', 'parent', 'student'],
        isPinned: true,
      },
      {
        branchId: branch.id,
        postedById: adminUser.id,
        title: 'First Term Exams',
        body: 'First term exams start on 15 November. Good luck!',
        targetRoles: ['teacher', 'parent', 'student'],
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete.');
  console.log('Demo login: admin@demo.pk / password123');
  console.log('Demo login: teacher@demo.pk / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
