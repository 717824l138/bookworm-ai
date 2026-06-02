export type Book = {
  id: string;
  title: string;
  author: string;
  genres: string[];
  audience: string;
  year: number;
  description: string;
};

export const BOOKS: Book[] = [
  { id: "1", title: "The Name of the Wind", author: "Patrick Rothfuss", genres: ["fantasy", "epic"], audience: "adult", year: 2007, description: "A gifted young man recounts his rise from orphan to legendary arcanist in a richly imagined world of music and magic." },
  { id: "2", title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", genres: ["fantasy", "coming-of-age"], audience: "teens", year: 1968, description: "A young wizard's reckless ambition unleashes a shadow he must learn to face on an island world of sea and sorcery." },
  { id: "3", title: "Six of Crows", author: "Leigh Bardugo", genres: ["fantasy", "heist", "ya"], audience: "teens", year: 2015, description: "Six dangerous outcasts attempt an impossible heist in a gritty Dickensian city of merchants and magic." },
  { id: "4", title: "The Hobbit", author: "J.R.R. Tolkien", genres: ["fantasy", "adventure"], audience: "teens", year: 1937, description: "A reluctant hobbit joins a band of dwarves on a quest to reclaim treasure guarded by the dragon Smaug." },
  { id: "5", title: "Project Hail Mary", author: "Andy Weir", genres: ["sci-fi", "thriller"], audience: "adult", year: 2021, description: "A lone astronaut wakes with no memory aboard a desperate mission to save humanity, and finds unexpected company." },
  { id: "6", title: "Dune", author: "Frank Herbert", genres: ["sci-fi", "epic"], audience: "adult", year: 1965, description: "On the desert planet Arrakis, a noble heir becomes the focal point of a galactic struggle over the most valuable substance in the universe." },
  { id: "7", title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genres: ["sci-fi", "literary"], audience: "adult", year: 1969, description: "An envoy to an icebound world navigates politics and identity on a planet where gender is fluid." },
  { id: "8", title: "Pride and Prejudice", author: "Jane Austen", genres: ["romance", "classic"], audience: "adult", year: 1813, description: "Elizabeth Bennet's wit collides with Mr. Darcy's pride in a sparkling comedy of Regency manners and matrimony." },
  { id: "9", title: "The Song of Achilles", author: "Madeline Miller", genres: ["romance", "mythology", "historical"], audience: "adult", year: 2011, description: "A lyrical retelling of the love between Achilles and Patroclus set against the looming shadow of the Trojan War." },
  { id: "10", title: "Beach Read", author: "Emily Henry", genres: ["romance", "contemporary"], audience: "adult", year: 2020, description: "Two rival novelists swap genres for a summer and discover that opposites really do attract." },
  { id: "11", title: "Gone Girl", author: "Gillian Flynn", genres: ["thriller", "mystery"], audience: "adult", year: 2012, description: "When Amy disappears on her anniversary, her husband becomes the prime suspect in a twisting tale of marriage gone wrong." },
  { id: "12", title: "The Silent Patient", author: "Alex Michaelides", genres: ["thriller", "mystery"], audience: "adult", year: 2019, description: "A psychotherapist becomes obsessed with unraveling why a famous painter shot her husband, then never spoke again." },
  { id: "13", title: "And Then There Were None", author: "Agatha Christie", genres: ["mystery", "classic"], audience: "adult", year: 1939, description: "Ten strangers are lured to an island where they are murdered one by one in a perfectly engineered puzzle." },
  { id: "14", title: "Sapiens", author: "Yuval Noah Harari", genres: ["non-fiction", "history"], audience: "adult", year: 2011, description: "A sweeping tour of how Homo sapiens conquered the planet through stories, agriculture, money, and science." },
  { id: "15", title: "Atomic Habits", author: "James Clear", genres: ["non-fiction", "self-help"], audience: "adult", year: 2018, description: "A practical framework for building tiny habits that compound into remarkable personal change." },
  { id: "16", title: "Educated", author: "Tara Westover", genres: ["non-fiction", "memoir"], audience: "adult", year: 2018, description: "A young woman raised off the grid in Idaho fights her way into Cambridge and reckons with the family she left behind." },
  { id: "17", title: "Wonder", author: "R.J. Palacio", genres: ["middle-grade", "contemporary"], audience: "children", year: 2012, description: "A boy with a facial difference starts mainstream school for the first time and changes everyone around him." },
  { id: "18", title: "Percy Jackson: The Lightning Thief", author: "Rick Riordan", genres: ["fantasy", "middle-grade"], audience: "children", year: 2005, description: "A twelve-year-old discovers he is the son of Poseidon and must stop a war among the Greek gods." },
  { id: "19", title: "The Way of Kings", author: "Brandon Sanderson", genres: ["fantasy", "epic"], audience: "adult", year: 2010, description: "On a storm-scoured world, a slave, a scholar, and a soldier are drawn toward an ancient power as humanity's last defense crumbles." },
  { id: "20", title: "Klara and the Sun", author: "Kazuo Ishiguro", genres: ["sci-fi", "literary"], audience: "adult", year: 2021, description: "An observant solar-powered Artificial Friend watches the human family she serves and quietly hopes to save them." },
  { id: "21", title: "The Night Circus", author: "Erin Morgenstern", genres: ["fantasy", "romance"], audience: "adult", year: 2011, description: "Two young magicians bound by a lifelong duel fall in love inside a mysterious black-and-white circus that appears without warning." },
  { id: "22", title: "Mistborn: The Final Empire", author: "Brandon Sanderson", genres: ["fantasy", "heist"], audience: "teens", year: 2006, description: "A street thief discovers she can fuel magic by burning metals and joins a crew plotting to topple an immortal god-emperor." },
];
