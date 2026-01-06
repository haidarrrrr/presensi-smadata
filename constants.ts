
export const SCHOOL_COORDS = {
  lat: -8.156534,
  lng: 113.447512,
  radius: 200, // meters
  name: "SMAN 2 Tanggul"
};

export const MOCK_STUDENT = {
  id: "2024001",
  name: "Ahmad Rifai",
  class: "XII MIPA 1",
  points: 120,
  violations: 2,
  avatar: "https://picsum.photos/seed/ahmad/200"
};

export const REWARD_TYPES = [
  { id: 'R1', label: 'Juara Kelas', points: 50 },
  { id: 'R2', label: 'Lomba Nasional', points: 100 },
  { id: 'R3', label: 'Aktif Organisasi', points: 20 },
  { id: 'R4', label: 'Membantu Guru', points: 10 },
];

export const VIOLATION_TYPES = [
  { id: 'V1', label: 'Terlambat', points: -5 },
  { id: 'V2', label: 'Atribut Tidak Lengkap', points: -10 },
  { id: 'V3', label: 'Bolos Pelajaran', points: -25 },
  { id: 'V4', label: 'Merusak Fasilitas', points: -50 },
];
