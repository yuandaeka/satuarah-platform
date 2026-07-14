export const REGULER_LYRICS = [
  { time: 0, text: "Ayo kita kawan mengenal si Mars... 🎶" },
  { time: 3, text: "Planet nomor empat, merah warnanya... 🌌" },
  { time: 7, text: "Mengorbit Matahari bersama Bumi... 🪐" },
  { time: 11, text: "Kaya besi oksida, itu tanahnya! 🔴" }
];

export const TUNANETRA_STORIES = [
  {
    title: "Bagian 1: Kedatangan Kancil ke Planet Mars",
    audioText: "Hai teman-teman, dengarkan petualangan Kancil yang menggunakan roket ramah lingkungan terbang ke luar angkasa menuju Mars. Mars adalah planet berwarna merah menyala karena permukaannya dilapisi debu besi berkarat. Di sana gravitasi lebih ringan, sehingga Kancil bisa melompat tinggi sekali seperti kangguru!",
    question: "Apakah warna dari planet Mars?"
  },
  {
    title: "Bagian 2: Atmosfer Mars yang Dingin",
    audioText: "Di Mars udara sangat dingin sekali, Kancil memakai baju astronot bulu tebal. Di sana tidak banyak oksigen, jadi kita harus menggunakan tangki oksigen untuk bernafas. Di Mars juga ada gunung berapi terbesar di tata surya bernama Gunung Olympus Mons!",
    question: "Apakah nama gunung terbesar di Mars?"
  }
];

export const INITIAL_PLANET_CARDS = [
  { id: 0, emoji: '🔴', label: 'Mars', isPlanet: true, factSuccess: 'Keren! Mars adalah planet keempat dari Matahari.', factFail: 'Ups! Mars adalah planet berbatu, bukan bintang atau objek lainnya.' },
  { id: 1, emoji: '🪐', label: 'Jupiter', isPlanet: true, factSuccess: 'Luar biasa! Jupiter adalah planet terbesar di Tata Surya.', factFail: 'Ups! Jupiter adalah planet gas raksasa.' },
  { id: 2, emoji: '💨', label: 'Besi Oksida', isPlanet: false, factSuccess: 'Tepat! Besi Oksida adalah senyawa kimia penyusun tanah Mars, bukan planet.', factFail: 'Besi Oksida adalah debu besi berkarat, bukan planet!' },
  { id: 3, emoji: '☀️', label: 'Matahari', isPlanet: false, factSuccess: 'Benar! Matahari adalah Bintang induk di pusat Tata Surya.', factFail: 'Matahari adalah Bintang, bukan planet!' },
  { id: 4, emoji: '🌋', label: 'Olympus Mons', isPlanet: false, factSuccess: 'Bagus! Olympus Mons adalah gunung berapi raksasa di Mars, bukan planet.', factFail: 'Olympus Mons adalah gunung berapi terbesar di Mars, bukan planet!' },
  { id: 5, emoji: '🌍', label: 'Bumi', isPlanet: true, factSuccess: 'Hebat! Bumi adalah planet hunian kita yang kaya air dan oksigen.', factFail: 'Bumi adalah planet rumah kita!' },
  { id: 6, emoji: '🪐', label: 'Saturnus', isPlanet: true, factSuccess: 'Luar biasa! Saturnus terkenal dengan cincin esnya yang indah.', factFail: 'Saturnus adalah planet gas raksasa dengan cincin!' },
  { id: 7, emoji: '👽', label: 'Alien', isPlanet: false, factSuccess: 'Benar! Alien adalah makhluk hidup fiksi luar angkasa, bukan planet.', factFail: 'Alien adalah makhluk hidup rekaan, bukan planet!' },
];
