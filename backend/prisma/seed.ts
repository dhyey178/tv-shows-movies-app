import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Start seeding...');

  await prisma.comment.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.tvShow.deleteMany({});
  console.log('Cleared existing data.');

  const movieData = [
    {
      title: "The Diplomat",
      description: "An Indian diplomat who tries to repatriate an Indian girl from Pakistan, where she was presumably forced and deceived into marrying against her will.",
      releaseYear: 2025,
      genre: JSON.stringify(["Action", "Thriller"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e0/The_Diplomat_2025_film.jpeg",
      cast: JSON.stringify(["John Abraham", "Priya Bapat", "Sharvari Wagh"]),
      director: "Shivom Nair",
      duration: 130
    },
    {
      title: "Mission: Impossible – The Final Reckoning",
      description: "Ethan Hunt and the IMF team race against time to find the Entity, a rogue artificial intelligence that can destroy mankind.",
      releaseYear: 2025,
      genre: JSON.stringify(["Action", "Thriller"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1f/Mission_Impossible_%E2%80%93_The_Final_Reckoning_Poster.jpg",
      cast: JSON.stringify(["Tom Cruise", "Hayley Atwell", "Ving Rhames", "Simon Pegg", "Rebecca Ferguson"]),
      director: "Christopher McQuarrie",
      duration: 163
    },
    {
      title: "Lagaan: Once Upon a Time in India",
      description: "In 1893, in a small village in colonial India, a farmer rallies villagers to challenge a tyrannical British officer to a cricket match.",
      releaseYear: 2001,
      genre: JSON.stringify(["Musical", "Drama", "Sport"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b6/Lagaan.jpg",
      cast: JSON.stringify(["Aamir Khan", "Gracy Singh", "Rachel Shelley", "Paul Blackthorne"]),
      director: "Ashutosh Gowariker",
      duration: 224
    },
    {
      title: "The Dark Knight",
      description: "Batman, with the help of Commissioner Gordon and Harvey Dent, sets out to dismantle the remaining criminal organizations in Gotham, but faces a new challenge from a criminal mastermind known as the Joker.",
      releaseYear: 2008,
      genre: JSON.stringify(["Action", "Crime", "Drama"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
      cast: JSON.stringify(["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine", "Maggie Gyllenhaal", "Gary Oldman", "Morgan Freeman"]),
      director: "Christopher Nolan",
      duration: 152
    },
    {
      title: "Gangs of Wasseypur - Part 1",
      description: "A clash between Sultan and Shahid Khan leads to a long-standing blood feud that spans over three generations.",
      releaseYear: 2012,
      genre: JSON.stringify(["Action", "Crime", "Drama"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/6a/Gangs_of_Wasseypur_poster.jpg",
      cast: JSON.stringify(["Manoj Bajpayee", "Nawazuddin Siddiqui", "Richa Chadha", "Huma Qureshi", "Piyush Mishra"]),
      director: "Anurag Kashyap",
      duration: 160
    },
    {
      title: "The Godfather",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      releaseYear: 1972,
      genre: JSON.stringify(["Crime", "Drama"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
      cast: JSON.stringify(["Marlon Brando", "Al Pacino", "James Caan", "Richard S. Castellano", "Robert Duvall", "Sterling Hayden"]),
      director: "Francis Ford Coppola",
      duration: 175
    },
    {
      title: "Mughal-E-Azam",
      description: "A 16th-century Mughal prince falls in love with a court dancer, leading to a rebellion against his emperor father.",
      releaseYear: 1960,
      genre: JSON.stringify(["Drama", "Romance", "Historical"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/16/Mughal-e-Azam.jpg",
      cast: JSON.stringify(["Prithviraj Kapoor", "Dilip Kumar", "Madhubala", "Durga Khote"]),
      director: "K. Asif",
      duration: 197
    },
    {
      title: "12 Angry Men",
      description: "A jury of 12 men deliberates the innocence or guilt of a teenager accused of murder, with one juror sowing seeds of doubt.",
      releaseYear: 1957,
      genre: JSON.stringify(["Drama", "Thriller"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/12_Angry_Men_%281957_film_poster%29.jpg/500px-12_Angry_Men_%281957_film_poster%29.jpg",
      cast: JSON.stringify(["Henry Fonda", "Lee J. Cobb", "Martin Balsam", "Jack Warden", "E.G. Marshall"]),
      director: "Sidney Lumet",
      duration: 96
    },
    {
      title: "3 Idiots",
      description: "Two friends embark on a quest for a third friend, who mysteriously disappeared after inspiring them to think differently during their college days.",
      releaseYear: 2009,
      genre: JSON.stringify(["Comedy", "Drama", "Romance"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
      cast: JSON.stringify(["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor Khan", "Boman Irani"]),
      director: "Rajkumar Hirani",
      duration: 170
    },
    {
      title: "Inception",
      description: "A skilled thief who steals information by entering people's dreams is given the inverse task of planting an idea into a target's subconscious.",
      releaseYear: 2010,
      genre: JSON.stringify(["Sci-Fi", "Action", "Thriller"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
      cast: JSON.stringify(["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy", "Ken Watanabe", "Cillian Murphy", "Marion Cotillard", "Michael Caine"]),
      director: "Christopher Nolan",
      duration: 148
    },
    {
      title: "Zindagi Na Milegi Dobara",
      description: "Three friends on a bachelor trip in Spain confront their fears, rediscover themselves, and strengthen their bond.",
      releaseYear: 2011,
      genre: JSON.stringify(["Comedy", "Drama", "Romance"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/17/Zindagi_Na_Milegi_Dobara.jpg",
      cast: JSON.stringify(["Hrithik Roshan", "Farhan Akhtar", "Abhay Deol", "Katrina Kaif", "Kalki Koechlin"]),
      director: "Zoya Akhtar",
      duration: 155
    },
    {
      title: "The Lion King",
      description: "Lion cub Simba is destined to rule the African savanna, but tragedy strikes when his evil uncle Scar takes over, forcing Simba into exile.",
      releaseYear: 1994,
      genre: JSON.stringify(["Animation", "Adventure", "Drama"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg",
      cast: JSON.stringify(["Matthew Broderick", "Jeremy Irons", "James Earl Jones", "Nathan Lane", "Ernie Sabella", "Whoopi Goldberg"]),
      director: "Roger Allers, Rob Minkoff",
      duration: 88
    },
    {
      title: "A Wednesday",
      description: "A retired police commissioner recounts the most challenging case of his career, involving an ordinary man's extraordinary plan to expose the system.",
      releaseYear: 2008,
      genre: JSON.stringify(["Thriller", "Drama"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/77/A_Wednesday_Poster.JPG",
      cast: JSON.stringify(["Naseeruddin Shah", "Anupam Kher", "Jimmy Sheirgill"]),
      director: "Neeraj Pandey",
      duration: 103
    }
  ];

  const createdMovies = {};
  for (let i=movieData.length - 1; i>=0; i--){
    const newMovie = await prisma.movie.create({ data: movieData[i] });
    createdMovies[newMovie.title] = newMovie.id;
    console.log(`Created movie: ${newMovie.title} with id: ${newMovie.id}`);
    await delay(50);
  }

  const tvShowData = [
    {
      title: "The Last Of Us",
      description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
      releaseYear: 2023,
      seasons: 2,
      episodes: 16,
      genre: JSON.stringify(["Action", "Adventure", "Drama", "Post-apocalyptic"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/ce/The_Last_of_Us_season_2_poster.png",
      cast: JSON.stringify(["Pedro Pascal", "Bella Ramsey", "Gabriel Luna", "Anna Torv", "Storm Reid"]),
      creator: "Craig Mazin, Neil Druckmann"
    },
    {
      title: "Dabba Cartel",
      description: "Five middle-class women operating a traditional dabbawala (lunchbox) service unexpectedly become involved in a high-stakes drug operation.",
      releaseYear: 2025,
      seasons: 1,
      episodes: 7,
      genre: JSON.stringify(["Crime Drama", "Black Comedy"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/74/Dabba_Cartel.jpg",
      cast: JSON.stringify(["Shabana Azmi", "Jyothika", "Shalini Pandey", "Nimisha Sajayan", "Anjali Anand"]),
      creator: "Shibani Dandekar Akhtar, Vishnu Menon, Gaurav Kapur, Akanksha Seda"
    },
    {
      title: "Panchayat",
      description: "An urban engineering graduate, struggling with job prospects, reluctantly takes on a low-salary position as a Panchayat secretary in a remote Indian village, navigating its unique challenges and charms.",
      releaseYear: 2020,
      seasons: 3,
      episodes: 24,
      genre: JSON.stringify(["Comedy", "Drama"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1a/Panchayat_logo.jpg",
      cast: JSON.stringify(["Jitendra Kumar", "Raghubir Yadav", "Neena Gupta", "Chandan Roy", "Faisal Malik", "Sanvikaa"]),
      creator: "The Viral Fever"
    },
    {
      title: "Breaking Bad",
      description: "A high school chemistry teacher, diagnosed with inoperable lung cancer, turns to a life of crime by producing and selling methamphetamine to secure his family's financial future.",
      releaseYear: 2008,
      seasons: 5,
      episodes: 62,
      genre: JSON.stringify(["Crime", "Drama", "Thriller"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/8b/Breaking_Bad_season_five_part_i_and_ii_dvd.png",
      cast: JSON.stringify(["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Dean Norris", "Betsy Brandt", "RJ Mitte", "Bob Odenkirk", "Giancarlo Esposito", "Jonathan Banks"]),
      creator: "Vince Gilligan"
    },
    {
      title: "Farzi",
      description: "A disillusioned artist, frustrated by income inequality, decides to create counterfeit money with his best friend, putting them on a collision course with a determined task force officer.",
      releaseYear: 2023,
      seasons: 1,
      episodes: 8,
      genre: JSON.stringify(["Black Comedy", "Crime Thriller"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d2/Farzi.jpeg",
      cast: JSON.stringify(["Shahid Kapoor", "Vijay Sethupathi", "Kay Kay Menon", "Raashii Khanna", "Bhuvan Arora"]),
      creator: "Raj & DK"
    },
    {
      title: "Band of Brothers",
      description: "Based on historical accounts, this miniseries follows Easy Company of the 101st Airborne Division from their rigorous training to their participation in major World War II battles.",
      releaseYear: 2001,
      seasons: 1,
      episodes: 10,
      genre: JSON.stringify(["War", "Drama", "Historical"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f0/BandofBrothersIntertitle.jpg",
      cast: JSON.stringify(["Damian Lewis", "Ron Livingston", "Donnie Wahlberg", "Scott Grimes", "Shane Taylor", "Dexter Fletcher"]),
      creator: "Steven Spielberg, Tom Hanks"
    },
    {
      title: "Mirzapur",
      description: "Set in the lawless city of Mirzapur, the series chronicles the power struggles, revenge, and family feuds within the Tripathi family, led by crime boss Akhandanand Tripathi.",
      releaseYear: 2018,
      seasons: 3,
      episodes: 29,
      genre: JSON.stringify(["Crime Thriller", "Action"]),
      imageUrl: "https://rukminim2.flixcart.com/image/850/1000/l0h1g280/poster/w/g/d/small-mirzapur-web-series-poster-multicolor-photopaper-print-12-original-imagc95dpwwmqcbg.jpeg?q=90&crop=false",
      cast: JSON.stringify(["Pankaj Tripathi", "Ali Fazal", "Divyendu Sharma", "Shweta Tripathi Sharma", "Rasika Dugal", "Vikrant Massey"]),
      creator: "Karan Anshuman, Puneet Krishna"
    },
    {
      title: "The Wire",
      description: "Set in Baltimore, this series offers a realistic exploration of the drug trade through the eyes of drug dealers and law enforcement officers, delving into its systemic impact on various institutions.",
      releaseYear: 2002,
      seasons: 5,
      episodes: 60,
      genre: JSON.stringify(["Crime", "Drama", "Thriller"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/10/The-wire-season-5-dvd.jpg",
      cast: JSON.stringify(["Dominic West", "Lance Reddick", "Sonja Sohn", "Idris Elba", "Wood Harris", "Clarke Peters", "Wendell Pierce"]),
      creator: "David Simon"
    },
    {
      title: "Kota Factory",
      description: "Set in Kota, India, a hub for competitive exam coaching, the series follows the lives of students preparing for IIT-JEE exams, navigating academic pressures and personal challenges.",
      releaseYear: 2019,
      seasons: 3,
      episodes: 15,
      genre: JSON.stringify(["Drama", "Comedy", "Coming-of-age"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/25/Kota_Factory_2_poster.jpg",
      cast: JSON.stringify(["Jitendra Kumar", "Mayur More", "Ahsaas Channa", "Alam Khan", "Ranjan Raj", "Revathi Pillai"]),
      creator: "The Viral Fever"
    },
    {
      title: "Game of Thrones",
      description: "Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy awakens after millennia.",
      releaseYear: 2011,
      seasons: 8,
      episodes: 73,
      genre: JSON.stringify(["Fantasy", "Drama", "Adventure"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg",
      cast: JSON.stringify(["Peter Dinklage", "Lena Headey", "Emilia Clarke", "Kit Harington", "Sophie Turner", "Maisie Williams", "Nikolaj Coster-Waldau"]),
      creator: "David Benioff, D. B. Weiss"
    },
    {
      title: "Sherlock",
      description: "A modern update of the classic British detective, Sherlock Holmes, who solves intricate cases in 21st-century London alongside his flatmate Dr. John Watson.",
      releaseYear: 2010,
      seasons: 4,
      episodes: 13,
      genre: JSON.stringify(["Mystery", "Crime", "Drama"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Sherlock_titlecard.jpg",
      cast: JSON.stringify(["Benedict Cumberbatch", "Martin Freeman", "Una Stubbs", "Rupert Graves", "Mark Gatiss", "Andrew Scott"]),
      creator: "Steven Moffat, Mark Gatiss"
    },
    {
      title: "The Office (US)",
      description: "A mockumentary about the everyday lives of office employees in the Scranton, Pennsylvania, branch of the fictional Dunder Mifflin Paper Company.",
      releaseYear: 2005,
      seasons: 9,
      episodes: 201,
      genre: JSON.stringify(["Comedy", "Mockumentary"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/32/The_Office_S9_DVD.jpg",
      cast: JSON.stringify(["Steve Carell", "Rainn Wilson", "John Krasinski", "Jenna Fischer", "B.J. Novak", "Ed Helms", "Mindy Kaling"]),
      creator: "Greg Daniels, Ricky Gervais, Stephen Merchant"
    },
    {
      title: "Friends",
      description: "Follows the personal and professional lives of six twenty-somethings living in Manhattan, as they navigate love, friendship, and careers.",
      releaseYear: 1994,
      seasons: 10,
      episodes: 236,
      genre: JSON.stringify(["Comedy", "Romance"]),
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/20/Friends_Season_10_DVD.jpg",
      cast: JSON.stringify(["Jennifer Aniston", "Courteney Cox", "Lisa Kudrow", "Matt LeBlanc", "Matthew Perry", "David Schwimmer"]),
      creator: "David Crane, Marta Kauffman"
    }
  ];

  const createdTvShows = {};

  for (let i=tvShowData.length - 1; i>=0; i--){
    const newTvShow = await prisma.tvShow.create({ data: tvShowData[i] });
    createdTvShows[newTvShow.title] = newTvShow.id;
    console.log(`Created TV Show: ${newTvShow.title} with id: ${newTvShow.id}`);
    await delay(50);
  }

  const commentsData = [
    { content: 'A compelling diplomatic thriller with a strong central performance.', author: 'Ankit R.', rating: 8, avatar: 'https://avatar.iran.liara.run/public/4', movieId_placeholder: 'The Diplomat' },
    { content: 'Intriguing plot and kept me engaged throughout. Excited to see more from this director.', author: 'Priyanka S.', rating: 7, avatar: 'https://avatar.iran.liara.run/public/54', movieId_placeholder: 'The Diplomat' },

    { content: 'Still mind-bending after all these years! A true cinematic marvel.', author: 'Liam Johnson', rating: 10, avatar: 'https://i.pravatar.cc/150?img=1', movieId_placeholder: 'Inception' },
    { content: 'The concept was incredible, but sometimes it felt a bit convoluted.', author: 'Sophia Brown', rating: 7, avatar: 'https://i.pravatar.cc/150?img=2', movieId_placeholder: 'Inception' },
    { content: 'Nolan is a genius. Every scene is meticulously crafted.', author: 'Ethan Miller', rating: 9, movieId_placeholder: 'Inception' },
    { content: 'The ending still sparks debates! What a ride.', author: 'Olivia Davis', rating: 9, avatar: 'https://i.pravatar.cc/150?img=3', movieId_placeholder: 'Inception' },
    { content: 'Too much exposition for my taste. Beautiful visuals though.', author: 'Noah Garcia', rating: 6, movieId_placeholder: 'Inception' },
    { content: 'An absolute masterpiece. Highly re-watchable!', author: 'Ava Rodriguez', rating: 10, avatar: 'https://i.pravatar.cc/150?img=4', movieId_placeholder: 'Inception' },

    { content: 'Heath Ledger\'s Joker performance is legendary. Still gives me chills!', author: 'Chris Evans', rating: 10, avatar: 'https://i.pravatar.cc/150?img=5', movieId_placeholder: 'The Dark Knight' },
    { content: 'Best superhero movie ever made. Period.', author: 'Sarah Jenkins', rating: 10, movieId_placeholder: 'The Dark Knight' },
    { content: 'Compelling story and intense action. A perfect blend.', author: 'David Wilson', rating: 9, avatar: 'https://i.pravatar.cc/150?img=6', movieId_placeholder: 'The Dark Knight' },
    { content: 'Christian Bale\'s Batman is iconic. The gravelly voice grew on me.', author: 'Emily White', rating: 8, movieId_placeholder: 'The Dark Knight' },
    { content: 'Bit too long for a re-watch, but still an amazing film.', author: 'James Taylor', rating: 7, avatar: 'https://i.pravatar.cc/150?img=7', movieId_placeholder: 'The Dark Knight' },
    { content: 'The moral dilemmas in this movie make it stand out.', author: 'Jessica Lee', rating: 9, movieId_placeholder: 'The Dark Knight' },
    { content: 'Action scenes were great, especially the truck flip!', author: 'Daniel Clark', rating: 8, avatar: 'https://i.pravatar.cc/150?img=8', movieId_placeholder: 'The Dark Knight' },
    { content: 'Truly dark and gritty, just how a Batman movie should be.', author: 'Hannah Lewis', rating: 9, movieId_placeholder: 'The Dark Knight' },

    { content: 'A classic that truly captures the spirit of resilience. Amazing music!', author: 'Rina Sharma', rating: 10, avatar: 'https://i.pravatar.cc/150?img=9', movieId_placeholder: 'Lagaan: Once Upon a Time in India' },
    { content: 'The cricket match kept me on the edge of my seat. Such a unique concept for a film.', author: 'Amit Kumar', rating: 9, movieId_placeholder: 'Lagaan: Once Upon a Time in India' },
    { content: 'Long but worth every minute. Emotional and inspiring.', author: 'Priya Singh', rating: 8, avatar: 'https://i.pravatar.cc/150?img=10', movieId_placeholder: 'Lagaan: Once Upon a Time in India' },
    { content: 'Aamir Khan was brilliant! The entire cast delivered.', author: 'Vivek Malhotra', rating: 9, movieId_placeholder: 'Lagaan: Once Upon a Time in India' },
    { content: 'One of the finest period dramas from Indian cinema.', author: 'Sita Devi', rating: 10, avatar: 'https://i.pravatar.cc/150?img=11', movieId_placeholder: 'Lagaan: Once Upon a Time in India' },
    { content: 'The story is powerful, but it dragged a bit in the middle.', author: 'Arjun Reddy', rating: 7, movieId_placeholder: 'Lagaan: Once Upon a Time in India' },
    { content: 'Simply timeless. A must-watch for everyone.', author: 'Meera Rao', rating: 9, avatar: 'https://i.pravatar.cc/150?img=12', movieId_placeholder: 'Lagaan: Once Upon a Time in India' },

    { content: 'Brutal, raw, and absolutely gripping. An authentic portrayal.', author: 'Rahul Sharma', rating: 9, avatar: 'https://i.pravatar.cc/150?img=13', movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'The acting by Nawazuddin Siddiqui is phenomenal. He carries the film.', author: 'Deepika Singh', rating: 10, movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'Violent but necessary for the narrative. A cinematic experience.', author: 'Arjun Khanna', rating: 8, avatar: 'https://i.pravatar.cc/150?img=14', movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'Loved the music and the gritty realism. Not for the faint-hearted.', author: 'Kavita Mishra', rating: 8, movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'It felt a bit disjointed at times, but the performances made up for it.', author: 'Sanjay Gupta', rating: 7, avatar: 'https://i.pravatar.cc/150?img=15', movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'An Anurag Kashyap masterpiece. So much depth in the characters.', author: 'Pooja Reddy', rating: 9, movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'Absolutely brilliant storytelling. Keeps you hooked from start to finish.', author: 'Vikas Sharma', rating: 10, avatar: 'https://i.pravatar.cc/150?img=16', movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'The dialogues are iconic! So many memorable lines.', author: 'Neha Patel', rating: 9, movieId_placeholder: 'Gangs of Wasseypur - Part 1' },
    { content: 'Too much violence. Hard to watch sometimes.', author: 'Rajesh Kumar', rating: 5, movieId_placeholder: 'Gangs of Wasseypur - Part 1' },

    { content: 'A classic that transcends time. The performances are unmatched.', author: 'Michael B. Davis', rating: 10, avatar: 'https://i.pravatar.cc/150?img=17', movieId_placeholder: 'The Godfather' },
    { content: 'Coppola’s direction is masterful. Every scene is iconic.', author: 'Linda K. Peterson', rating: 10, movieId_placeholder: 'The Godfather' },
    { content: 'Al Pacino\'s transformation is breathtaking. A true acting lesson.', author: 'Robert J. White', rating: 9, avatar: 'https://i.pravatar.cc/150?img=18', movieId_placeholder: 'The Godfather' },
    { content: 'The ultimate gangster film. It set the standard.', author: 'Susan M. Brown', rating: 10, movieId_placeholder: 'The Godfather' },
    { content: 'Intricate plot and character development. Needs multiple viewings to appreciate fully.', author: 'Charles L. Green', rating: 9, avatar: 'https://i.pravatar.cc/150?img=19', movieId_placeholder: 'The Godfather' },
    { content: 'A bit slow-paced for modern audiences, but still holds up.', author: 'Nancy P. Hall', rating: 7, movieId_placeholder: 'The Godfather' },
    { content: 'The score alone is hauntingly beautiful.', author: 'George D. King', rating: 9, avatar: 'https://i.pravatar.cc/150?img=20', movieId_placeholder: 'The Godfather' },
    { content: 'Marlon Brando was born to play Vito Corleone.', author: 'Patricia S. Young', rating: 10, movieId_placeholder: 'The Godfather' },
    { content: 'Every dialogue is quotable. A truly epic film.', author: 'Thomas R. Wright', rating: 10, avatar: 'https://i.pravatar.cc/150?img=21', movieId_placeholder: 'The Godfather' },
    { content: 'The story of family and loyalty is so powerful.', author: 'Elizabeth D. Hill', rating: 9, movieId_placeholder: 'The Godfather' },
    { content: 'Watched it for the first time. Instantly became a favorite.', author: 'William F. Scott', rating: 10, avatar: 'https://i.pravatar.cc/150?img=22', movieId_placeholder: 'The Godfather' },
    { content: 'The realism and grit are captivating. It doesn\'t glorify crime.', author: 'Karen B. Adams', rating: 9, movieId_placeholder: 'The Godfather' },
    { content: 'Perhaps the greatest film in cinematic history. Every element is perfect.', author: 'Richard C. Baker', rating: 10, avatar: 'https://i.pravatar.cc/150?img=23', movieId_placeholder: 'The Godfather' },
    { content: 'A bit long, but you hardly notice the time passing.', author: 'Betty E. Nelson', rating: 8, movieId_placeholder: 'The Godfather' },
    { content: 'The character arcs are incredibly well-developed.', author: 'Joseph A. Carter', rating: 9, avatar: 'https://i.pravatar.cc/150?img=24', movieId_placeholder: 'The Godfather' },
    { content: 'Essential viewing for anyone interested in film.', author: 'Dorothy G. Mitchell', rating: 10, movieId_placeholder: 'The Godfather' },
    { content: 'Holds up perfectly. No CGI needed to make it impactful.', author: 'Steven H. Phillips', rating: 9, avatar: 'https://i.pravatar.cc/150?img=25', movieId_placeholder: 'The Godfather' },
    { content: 'The intricacies of the crime family are fascinating.', author: 'Donna J. Campbell', rating: 8, movieId_placeholder: 'The Godfather' },

    { content: 'Timeless romance and grand scale. Madhubala is mesmerizing.', author: 'Anjali Sharma', rating: 10, avatar: 'https://i.pravatar.cc/150?img=26', movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'The sets and costumes are breathtaking. A visual spectacle.', author: 'Rajesh Kumar', rating: 9, movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'Dilip Kumar\'s performance as Salim is unforgettable.', author: 'Priya Singh', rating: 9, avatar: 'https://i.pravatar.cc/150?img=27', movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'A true classic that showcases the golden era of Bollywood.', author: 'Sanjay Dutt', rating: 10, movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'The songs are iconic and beautifully picturized.', author: 'Meena Reddy', rating: 9, avatar: 'https://i.pravatar.cc/150?img=28', movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'Emotional depth and powerful performances. It truly resonates.', author: 'Ashok Gupta', rating: 8, movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'A bit slow by today\'s standards, but historically significant.', author: 'Kiran Rao', rating: 7, avatar: 'https://i.pravatar.cc/150?img=29', movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'The dialogues are pure poetry. An essential watch for Hindi cinema lovers.', author: 'Vivek Singh', rating: 9, movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'The climax is so dramatic and impactful.', author: 'Geeta Verma', rating: 10, avatar: 'https://i.pravatar.cc/150?img=30', movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'Every frame is a painting. Truly a work of art.', author: 'Rohit Khanna', rating: 9, movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'Still gives me goosebumps every time I watch it.', author: 'Shalini Devi', rating: 10, avatar: 'https://i.pravatar.cc/150?img=31', movieId_placeholder: 'Mughal-E-Azam' },
    { content: 'A little too theatrical for my taste, but undeniably grand.', author: 'Ravi Narayan', rating: 6, movieId_placeholder: 'Mughal-E-Azam' },

    { content: 'A masterclass in tension and dialogue. No need for special effects.', author: 'John P. Adams', rating: 10, avatar: 'https://i.pravatar.cc/150?img=32', movieId_placeholder: '12 Angry Men' },
    { content: 'Brilliantly written and performed. A true study in human nature.', author: 'Mary L. Harris', rating: 9, movieId_placeholder: '12 Angry Men' },
    { content: 'The progression of doubt is captivating. A must-watch for aspiring filmmakers.', author: 'Peter S. King', rating: 9, avatar: 'https://i.pravatar.cc/150?img=33', movieId_placeholder: '12 Angry Men' },
    { content: 'Simple premise, profound impact. Shows the power of a single voice.', author: 'Laura B. Turner', rating: 10, movieId_placeholder: '12 Angry Men' },
    { content: 'A bit dated in parts, but the message is timeless.', author: 'Chris W. Nelson', rating: 7, avatar: 'https://i.pravatar.cc/150?img=34', movieId_placeholder: '12 Angry Men' },
    { content: 'The pacing is perfect. Keeps you engrossed even in a single room.', author: 'Rebecca R. Green', rating: 9, movieId_placeholder: '12 Angry Men' },

    { content: 'This movie changed my perspective on education. Truly inspiring!', author: 'Rohan Mehta', rating: 10, avatar: 'https://i.pravatar.cc/150?img=35', movieId_placeholder: '3 Idiots' },
    { content: 'Hilarious and emotional. Aamir Khan is brilliant as Rancho.', author: 'Priyanka Das', rating: 9, movieId_placeholder: '3 Idiots' },
    { content: 'A must-watch for every student and parent. So many important lessons.', author: 'Suresh Iyer', rating: 10, avatar: 'https://i.pravatar.cc/150?img=36', movieId_placeholder: '3 Idiots' },
    { content: 'Felt a bit preachy at times, but the humor balances it out.', author: 'Ananya Sharma', rating: 7, movieId_placeholder: '3 Idiots' },
    { content: 'The friendship portrayed is so wholesome and real.', author: 'Karan Singh', rating: 9, avatar: 'https://i.pravatar.cc/150?img=37', movieId_placeholder: '3 Idiots' },
    { content: 'One of the best Bollywood movies of all time. Period.', author: 'Deepika Rao', rating: 10, movieId_placeholder: '3 Idiots' },
    { content: 'Rewatch it every year. Always makes me laugh and think.', author: 'Gaurav Jain', rating: 9, avatar: 'https://i.pravatar.cc/150?img=38', movieId_placeholder: '3 Idiots' },
    { content: 'The music is fantastic, especially \'Behti Hawa Sa Tha Woh\'.', author: 'Shalini Verma', rating: 8, movieId_placeholder: '3 Idiots' },
    { content: 'A truly heartwarming film with a powerful message.', author: 'Amitabh Bachchan', rating: 9, avatar: 'https://i.pravatar.cc/150?img=39', movieId_placeholder: '3 Idiots' },
    { content: 'A bit overhyped. It was good, but not groundbreaking.', author: 'Sameer Khan', rating: 6, movieId_placeholder: '3 Idiots' },

    { content: 'Perfect blend of travel, friendship, and self-discovery. Loved it!', author: 'Sanaya Kapoor', rating: 9, avatar: 'https://i.pravatar.cc/150?img=40', movieId_placeholder: 'Zindagi Na Milegi Dobara' },
    { content: 'The cinematography of Spain is stunning. Made me want to travel!', author: 'Arjun Desai', rating: 9, movieId_placeholder: 'Zindagi Na Milegi Dobara' },
    { content: 'Great cast chemistry and a truly refreshing story.', author: 'Ria Singh', rating: 8, avatar: 'https://i.pravatar.cc/150?img=41', movieId_placeholder: 'Zindagi Na Milegi Dobara' },
    { content: 'The poetry added such a beautiful touch to the narrative.', author: 'Vikram Choudhary', rating: 10, movieId_placeholder: 'Zindagi Na Milegi Dobara' },
    { content: 'A feel-good movie with a deep message. Highly recommend.', author: 'Poonam Sharma', rating: 9, avatar: 'https://i.pravatar.cc/150?img=42', movieId_placeholder: 'Zindagi Na Milegi Dobara' },
    { content: 'Not my usual genre, but I was pleasantly surprised. Very entertaining.', author: 'Karan Mehra', rating: 7, movieId_placeholder: 'Zindagi Na Milegi Dobara' },
    { content: 'The emotional moments were well-handled, not over the top.', author: 'Divya Rao', rating: 8, avatar: 'https://i.pravatar.cc/150?img=43', movieId_placeholder: 'Zindagi Na Milegi Dobara' },

    { content: 'An animated classic. The music is iconic, and the story is timeless.', author: 'Grace Taylor', rating: 10, avatar: 'https://i.pravatar.cc/150?img=44', movieId_placeholder: 'The Lion King' },
    { content: 'Still cry every time during *that* scene. Pure emotion!', author: 'Henry Wilson', rating: 9, movieId_placeholder: 'The Lion King' },
    { content: 'Hakuna Matata! A perfect family movie.', author: 'Sophie Green', rating: 9, avatar: 'https://i.pravatar.cc/150?img=45', movieId_placeholder: 'The Lion King' },
    { content: 'The animation and voice acting are superb.', author: 'Leo Martinez', rating: 8, movieId_placeholder: 'The Lion King' },
    { content: 'A fantastic coming-of-age story wrapped in beautiful visuals.', author: 'Chloe Brown', rating: 10, avatar: 'https://i.pravatar.cc/150?img=46', movieId_placeholder: 'The Lion King' },

    { content: 'Pedro Pascal and Bella Ramsey are phenomenal. Their chemistry makes the show.', author: 'Alex Turner', rating: 10, avatar: 'https://i.pravatar.cc/150?img=47', tvShowId_placeholder: 'The Last Of Us' },
    { content: 'Faithful adaptation of the game, yet it stands on its own. Incredible storytelling.', author: 'Sarah M. Reed', rating: 9, tvShowId_placeholder: 'The Last Of Us' },
    { content: 'The emotional depth is truly remarkable. Prepared for tears!', author: 'Ben Carter', rating: 10, avatar: 'https://i.pravatar.cc/150?img=48', tvShowId_placeholder: 'The Last Of Us' },
    { content: 'The infected are terrifying! Great horror elements.', author: 'Chloe G. Hall', rating: 9, tvShowId_placeholder: 'The Last Of Us' },
    { content: 'Episode 3 is a standalone masterpiece. Broke my heart.', author: 'Jake P. Scott', rating: 10, avatar: 'https://i.pravatar.cc/150?img=49', tvShowId_placeholder: 'The Last Of Us' },
    { content: 'A bit slow-paced at times, but the character development is worth it.', author: 'Maria D. Lee', rating: 8, tvShowId_placeholder: 'The Last Of Us' },
    { content: 'Absolutely stunning cinematography. The world feels so real.', author: 'Tom W. Green', rating: 9, avatar: 'https://i.pravatar.cc/150?img=50', tvShowId_placeholder: 'The Last Of Us' },
    { content: 'Did not play the game, but I was completely hooked from episode one.', author: 'Jessica L. Hill', rating: 9, tvShowId_placeholder: 'The Last Of Us' },
    { content: 'The show handles heavy themes with grace and realism.', author: 'Oliver K. Baker', rating: 10, avatar: 'https://i.pravatar.cc/150?img=51', tvShowId_placeholder: 'The Last Of Us' },
    { content: 'Some episodes felt a bit like filler, but the main plot is strong.', author: 'Hannah R. Adams', rating: 7, tvShowId_placeholder: 'The Last Of Us' },
    { content: 'The music is haunting and perfect for the setting.', author: 'Daniel E. Clark', rating: 9, avatar: 'https://i.pravatar.cc/150?img=52', tvShowId_placeholder: 'The Last Of Us' },
    { content: 'Binged it in a day. Cannot wait for season 2!', author: 'Sophie M. Davis', rating: 10, tvShowId_placeholder: 'The Last Of Us' },
    { content: 'A truly dark but compelling story. Not for the faint of heart.', author: 'Liam J. Miller', rating: 8, avatar: 'https://i.pravatar.cc/150?img=53', tvShowId_placeholder: 'The Last Of Us' },
    { content: 'The tension is unbearable at times, in a good way!', author: 'Ella F. Thomas', rating: 9, tvShowId_placeholder: 'The Last Of Us' },
    { content: 'The character development is top-tier. You really feel for them.', author: 'Caleb A. Wright', rating: 10, avatar: 'https://i.pravatar.cc/150?img=54', tvShowId_placeholder: 'The Last Of Us' },

    { content: 'Panchayat is pure gold! So relatable and heartwarming.', author: 'Akash Patel', rating: 10, avatar: 'https://i.pravatar.cc/150?img=55', tvShowId_placeholder: 'Panchayat' },
    { content: 'Jitendra Kumar\'s performance is flawless. He embodies the role.', author: 'Pooja Sharma', rating: 9, tvShowId_placeholder: 'Panchayat' },
    { content: 'Simple stories with deep messages. This show is a breath of fresh air.', author: 'Vijay Singh', rating: 9, avatar: 'https://i.pravatar.cc/150?img=56', tvShowId_placeholder: 'Panchayat' },
    { content: 'The humor is subtle and perfectly timed. Loved it!', author: 'Sneha Kumari', rating: 8, tvShowId_placeholder: 'Panchayat' },
    { content: 'Raghubir Yadav and Neena Gupta are outstanding. The heart of the show.', author: 'Ravi Verma', rating: 10, avatar: 'https://i.pravatar.cc/150?img=57', tvShowId_placeholder: 'Panchayat' },
    { content: 'A realistic portrayal of rural India without being preachy.', author: 'Divya Rao', rating: 9, tvShowId_placeholder: 'Panchayat' },
    { content: 'The emotional scenes are so well done. Genuinely touching.', author: 'Gaurav Dubey', rating: 9, avatar: 'https://i.pravatar.cc/150?img=58', tvShowId_placeholder: 'Panchayat' },
    { content: 'A must-watch for anyone who wants a slice of authentic Indian life.', author: 'Shreya Kapoor', rating: 10, tvShowId_placeholder: 'Panchayat' },
    { content: 'It started slow for me, but by season 2 I was completely invested.', author: 'Anil Gupta', rating: 7, avatar: 'https://i.pravatar.cc/150?img=59', tvShowId_placeholder: 'Panchayat' },
    { content: 'The dialogues are brilliant, witty and meaningful.', author: 'Meera Deshmukh', rating: 9, tvShowId_placeholder: 'Panchayat' },

    { content: 'Best show ever created. The writing is phenomenal, the character arcs are perfect.', author: 'Walter F. White', rating: 10, avatar: 'https://i.pravatar.cc/150?img=60', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Bryan Cranston and Aaron Paul deliver career-defining performances.', author: 'Jesse P. Pinkman', rating: 10, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'The tension building is unlike anything I\'ve ever seen.', author: 'Hank R. Schrader', rating: 9, avatar: 'https://i.pravatar.cc/150?img=61', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Every season just gets better and better. A true masterpiece.', author: 'Skyler A. White', rating: 10, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Vince Gilligan\'s storytelling is unmatched. Pure genius.', author: 'Gus F. Fring', rating: 9, avatar: 'https://i.pravatar.cc/150?img=62', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Started watching late, but binged the entire series in weeks. No regrets!', author: 'Marie S. Schrader', rating: 9, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'The transformation of Walter White is chilling and incredible.', author: 'Saul Goodman', rating: 10, avatar: 'https://i.pravatar.cc/150?img=63', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Dark, gritty, and utterly compelling. Not for the faint of heart.', author: 'Mike Ehrmantraut', rating: 9, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'The cinematography is underrated. So many memorable shots.', author: 'Lydia R. Rodarte-Quayle', rating: 9, avatar: 'https://i.pravatar.cc/150?img=64', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Gets a bit too violent sometimes, but it serves the story.', author: 'Todd Alquist', rating: 7, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'The character development across the board is truly exceptional.', author: 'Jane Margolis', rating: 10, avatar: 'https://i.pravatar.cc/150?img=65', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'One of the few shows that had a perfect ending.', author: 'Badger Mayhew', rating: 10, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Every episode leaves you wanting more. Unpredictable and thrilling.', author: 'Skinny Pete', rating: 9, avatar: 'https://i.pravatar.cc/150?img=66', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Truly disturbing how good it is. I couldn\'t stop watching.', author: 'Andrea Cantillo', rating: 9, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Some of the best villains in TV history.', author: 'Tuco Salamanca', rating: 8, avatar: 'https://i.pravatar.cc/150?img=67', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'This show made me rethink what TV can achieve. Groundbreaking.', author: 'Gale Boetticher', rating: 10, tvShowId_placeholder: 'Breaking Bad' },
    { content: 'The pacing is fantastic, never a dull moment.', author: 'Holly White', rating: 9, avatar: 'https://i.pravatar.cc/150?img=68', tvShowId_placeholder: 'Breaking Bad' },
    { content: 'Absolutely glued to my screen from start to finish. A modern classic.', author: 'Drew Sharp', rating: 10, tvShowId_placeholder: 'Breaking Bad' },

    { content: 'Shahid Kapoor and Vijay Sethupathi together? Absolute fire! Great show.', author: 'Sameer Singh', rating: 9, avatar: 'https://i.pravatar.cc/150?img=69', tvShowId_placeholder: 'Farzi' },
    { content: 'Intelligent writing and sharp dialogues. Raj & DK deliver again!', author: 'Aditi Rao', rating: 9, tvShowId_placeholder: 'Farzi' },
    { content: 'The cat-and-mouse chase was thrilling. Binged it in a weekend.', author: 'Rahul Verma', rating: 8, avatar: 'https://i.pravatar.cc/150?img=70', tvShowId_placeholder: 'Farzi' },
    { content: 'Kay Kay Menon is brilliant as always. His presence elevates every scene.', author: 'Priya Mehta', rating: 9, tvShowId_placeholder: 'Farzi' },
    { content: 'A fresh take on the crime thriller genre. Highly entertaining.', author: 'Kunal Deshpande', rating: 8, avatar: 'https://avatar.iran.liara.run/public/37', tvShowId_placeholder: 'Farzi' },
    { content: 'The humor is dark and perfectly placed. Loved the witty banter.', author: 'Anisha Gupta', rating: 9, tvShowId_placeholder: 'Farzi' },
    { content: 'Some parts felt a bit rushed, but overall a great watch.', author: 'Rajesh Kumar', rating: 7, avatar: 'https://avatar.iran.liara.run/public/20', tvShowId_placeholder: 'Farzi' },
    { content: 'The social commentary is subtle yet effective. A thought-provoking thriller.', author: 'Sneha Jain', rating: 8, tvShowId_placeholder: 'Farzi' },

    { content: 'The most accurate and powerful depiction of WWII combat ever filmed.', author: 'George Patton', rating: 10, avatar: 'https://avatar.iran.liara.run/public/6', tvShowId_placeholder: 'Band of Brothers' },
    { content: 'Every episode is a cinematic masterpiece. The emotional toll is palpable.', author: 'Stephen Ambrose', rating: 10, tvShowId_placeholder: 'Band of Brothers' },
    { content: 'Harrowing and heartbreaking, but essential viewing to understand the sacrifices made.', author: 'Audie Murphy', rating: 9, avatar: 'https://avatar.iran.liara.run/public/81', tvShowId_placeholder: 'Band of Brothers' },
    { content: 'The cast is incredible. So many future stars in one show.', author: 'Ronald Spiers', rating: 9, tvShowId_placeholder: 'Band of Brothers' },
    { content: 'It truly honors the men of Easy Company. A timeless tribute.', author: 'Richard Winters', rating: 10, avatar: 'https://avatar.iran.liara.run/public/45', tvShowId_placeholder: 'Band of Brothers' },
    { content: 'The realism is astounding. You feel like you\'re right there with them.', author: 'Bill Guarnere', rating: 9, tvShowId_placeholder: 'Band of Brothers' },
    { content: 'Intense and emotionally draining, but I couldn\'t stop watching.', author: 'Eugene Roe', rating: 8, avatar: 'https://avatar.iran.liara.run/public/70', tvShowId_placeholder: 'Band of Brothers' },
    { content: 'A powerful history lesson. Highly recommended for everyone.', author: 'Frank Perconte', rating: 10, tvShowId_placeholder: 'Band of Brothers' },
    { content: 'Not easy to watch at times, but crucial for historical understanding.', author: 'Joseph Liebgott', rating: 8, avatar: 'https://avatar.iran.liara.run/public/17', tvShowId_placeholder: 'Band of Brothers' },
    { content: 'A true testament to courage and camaraderie. An unforgettable series.', author: 'Carwood Lipton', rating: 10, tvShowId_placeholder: 'Band of Brothers' },

    { content: 'Raw, gritty, and addictive. Pankaj Tripathi is a force of nature!', author: 'Guddu Pandit', rating: 9, avatar: 'https://avatar.iran.liara.run/public/29', tvShowId_placeholder: 'Mirzapur' },
    { content: 'Kaleen Bhaiya\'s dialogues are iconic. The power dynamics are fascinating.', author: 'Munna Bhaiya', rating: 10, tvShowId_placeholder: 'Mirzapur' },
    { content: 'Violent and intense, but the story pulls you in. Hard to stop watching.', author: 'Sweety Gupta', rating: 8, avatar: 'https://avatar.iran.liara.run/public/73', tvShowId_placeholder: 'Mirzapur' },
    { content: 'The women characters are so strong and well-developed. A pleasant surprise.', author: 'Dimpy Pandit', rating: 9, tvShowId_placeholder: 'Mirzapur' },
    { content: 'It glorifies crime a bit, but the performances are top-notch.', author: 'Bablu Pandit', rating: 7, avatar: 'https://avatar.iran.liara.run/public/50', tvShowId_placeholder: 'Mirzapur' },
    { content: 'Absolutely gripping. The twists and turns keep you guessing.', author: 'Golu Gupta', rating: 10, tvShowId_placeholder: 'Mirzapur' },
    { content: 'The background score adds so much to the atmosphere.', author: 'Shukla Ji', rating: 8, avatar: 'https://avatar.iran.liara.run/public/9', tvShowId_placeholder: 'Mirzapur' },
    { content: 'It gets darker with each season. Not for everyone, but I love it.', author: 'Compounder', rating: 9, tvShowId_placeholder: 'Mirzapur' },
    { content: 'The action sequences are brutal but realistic.', author: 'Satyanand Tripathi', rating: 8, avatar: 'https://avatar.iran.liara.run/public/14', tvShowId_placeholder: 'Mirzapur' },
    { content: 'Too much violence, but the story is compelling enough to overlook it.', author: 'Lalita Gupta', rating: 6, tvShowId_placeholder: 'Mirzapur' },
    { content: 'The tension is palpable in every episode. Masterful.', author: 'Robin', rating: 9, avatar: 'https://avatar.iran.liara.run/public/36', tvShowId_placeholder: 'Mirzapur' },
    { content: 'I wish they would develop some characters more, but still good.', author: 'Beena Tripathi', rating: 7, tvShowId_placeholder: 'Mirzapur' },
    { content: 'The casting is perfect. Everyone fits their role.', author: 'Bharat Tyagi', rating: 10, avatar: 'https://avatar.iran.liara.run/public/38', tvShowId_placeholder: 'Mirzapur' },
    { content: 'Loved the plot twists, especially in season 2.', author: 'Zarina Begum', rating: 9, tvShowId_placeholder: 'Mirzapur' },

    { content: 'So relatable for anyone who went through competitive exam prep. Jeetu Bhaiya is awesome!', author: 'Vaibhav Pandey', rating: 10, avatar: 'https://avatar.iran.liara.run/public/3', tvShowId_placeholder: 'Kota Factory' },
    { content: 'A perfect blend of humor and emotional reality. Captures the student life perfectly.', author: 'Meena Kumari', rating: 9, tvShowId_placeholder: 'Kota Factory' },
    { content: 'The black and white cinematography adds so much to the mood. Very unique.', author: 'Uday Gupta', rating: 9, avatar: 'https://avatar.iran.liara.run/public/42', tvShowId_placeholder: 'Kota Factory' },
    { content: 'It highlights the pressure on students really well. Very insightful.', author: 'Shivani Sharma', rating: 8, tvShowId_placeholder: 'Kota Factory' },
    { content: 'Some dialogues are truly motivational. Inspiring show!', author: 'Varun Agarwal', rating: 10, avatar: 'https://avatar.iran.liara.run/public/35', tvShowId_placeholder: 'Kota Factory' },
    { content: 'Felt a bit repetitive by the third season, but still enjoyable.', author: 'Pooja Singh', rating: 7, tvShowId_placeholder: 'Kota Factory' },
    { content: 'The character development is fantastic. You truly root for them.', author: 'Karan Malhotra', rating: 9, avatar: 'https://avatar.iran.liara.run/public/10', tvShowId_placeholder: 'Kota Factory' },
    { content: 'The portrayal of friendship amidst the competition is beautiful.', author: 'Riya Gupta', rating: 9, tvShowId_placeholder: 'Kota Factory' },
    { content: 'It addresses important issues without being overly dramatic. Balaced.', author: 'Amit Kumar', rating: 8, avatar: 'https://avatar.iran.liara.run/public/39', tvShowId_placeholder: 'Kota Factory' },

    { content: 'Epic fantasy. Unforgettable characters and intricate plot lines.', author: 'Jon Snow', rating: 10, avatar: 'https://avatar.iran.liara.run/public/47', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'The early seasons are absolute masterpieces of television.', author: 'Daenerys Targaryen', rating: 9, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'Shocking twists and turns that kept me on the edge of my seat.', author: 'Tyrion Lannister', rating: 10, avatar: 'https://avatar.iran.liara.run/public/18', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'Visually stunning, the dragons are incredible!', author: 'Arya Stark', rating: 9, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'The ending was disappointing, but the journey was incredible.', author: 'Cersei Lannister', rating: 6, avatar: 'https://avatar.iran.liara.run/public/95', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'Complex political intrigue and fascinating world-building.', author: 'Ned Stark', rating: 9, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'Got a bit confusing with too many characters by the middle seasons.', author: 'Sansa Stark', rating: 7, avatar: 'https://avatar.iran.liara.run/public/72', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'The production value is insane for a TV show.', author: 'Jaime Lannister', rating: 9, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'I re-watch the first few seasons constantly. Pure gold.', author: 'Brienne of Tarth', rating: 10, avatar: 'https://avatar.iran.liara.run/public/57', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'Lost its way towards the end, but still a cultural phenomenon.', author: 'Jorah Mormont', rating: 7, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'The Red Wedding was brutal, but unforgettable.', author: 'Robb Stark', rating: 9, avatar: 'https://avatar.iran.liara.run/public/15', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'So many incredible moments. A truly immersive experience.', author: 'Melisandre', rating: 10, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'The character development for some was fantastic, others not so much.', author: 'Theon Greyjoy', rating: 8, avatar: 'https://avatar.iran.liara.run/public/28', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'It changed television. No other show quite like it.', author: 'Varys', rating: 10, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'A few plot holes emerged later, but the sheer scale is impressive.', author: 'Samwell Tarly', rating: 7, avatar: 'https://avatar.iran.liara.run/public/44', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'The battles are epic. Hard to believe it\'s a TV show.', author: 'The Hound', rating: 9, tvShowId_placeholder: 'Game of Thrones' },
    { content: 'Loved watching the direwolves and dragons grow up!', author: 'Bran Stark', rating: 8, avatar: 'https://avatar.iran.liara.run/public/21', tvShowId_placeholder: 'Game of Thrones' },
    { content: 'One of the best ensemble casts in television history.', author: 'Missandei', rating: 10, tvShowId_placeholder: 'Game of Thrones' },

    { content: 'Benedict Cumberbatch IS Sherlock Holmes. Brilliant writing and acting.', author: 'Dr. John Watson', rating: 10, avatar: 'https://avatar.iran.liara.run/public/25', tvShowId_placeholder: 'Sherlock' },
    { content: 'Every episode feels like a mini-movie. So clever and engaging.', author: 'Irene Adler', rating: 9, tvShowId_placeholder: 'Sherlock' },
    { content: 'Moriarty is one of the best villains ever. Spine-chilling!', author: 'Mycroft Holmes', rating: 10, avatar: 'https://avatar.iran.liara.run/public/40', tvShowId_placeholder: 'Sherlock' },
    { content: 'The modern setting works perfectly. A fresh take on a classic.', author: 'Mrs. Hudson', rating: 9, tvShowId_placeholder: 'Sherlock' },
    { content: 'Some mysteries were a bit too convoluted, but still fun to watch.', author: 'Lestrade', rating: 7, avatar: 'https://avatar.iran.liara.run/public/7', tvShowId_placeholder: 'Sherlock' },
    { content: 'The fast-paced dialogue and visual cues are fantastic.', author: 'Molly Hooper', rating: 9, tvShowId_placeholder: 'Sherlock' },
    { content: 'Wished there were more seasons! It ended too soon.', author: 'Jim Moriarty', rating: 8, avatar: 'https://avatar.iran.liara.run/public/48', tvShowId_placeholder: 'Sherlock' },
    { content: 'The mind palace sequences are incredibly creative.', author: 'Philip Anderson', rating: 9, tvShowId_placeholder: 'Sherlock' },
    { content: 'A thrilling ride from start to finish. Highly intelligent writing.', author: 'Sarah Sawyer', rating: 10, avatar: 'https://avatar.iran.liara.run/public/94', tvShowId_placeholder: 'Sherlock' },
    { content: 'The last season felt a bit off compared to the earlier ones.', author: 'Charles Magnussen', rating: 6, tvShowId_placeholder: 'Sherlock' },

    { content: 'Michael Scott is a comedic genius. This show never gets old!', author: 'Dwight K. Schrute', rating: 10, avatar: 'https://avatar.iran.liara.run/public/49', tvShowId_placeholder: 'The Office (US)' },
    { content: 'The Jim and Pam romance is iconic. Pure relationship goals.', author: 'Pam Beesly', rating: 9, tvShowId_placeholder: 'The Office (US)' },
    { content: 'I\'ve rewatched this show countless times. Always makes me laugh.', author: 'Kevin Malone', rating: 10, avatar: 'https://avatar.iran.liara.run/public/31', tvShowId_placeholder: 'The Office (US)' },
    { content: 'The cringe humor is so well done. It\'s painfully hilarious.', author: 'Angela Martin', rating: 9, tvShowId_placeholder: 'The Office (US)' },
    { content: 'Some later seasons felt a bit weaker, but the early ones are solid gold.', author: 'Andy Bernard', rating: 7, avatar: 'https://avatar.iran.liara.run/public/24', tvShowId_placeholder: 'The Office (US)' },
    { content: 'Every character is so unique and memorable. Dunder Mifflin forever!', author: 'Stanley Hudson', rating: 9, tvShowId_placeholder: 'The Office (US)' },
    { content: 'The show perfectly captures office dynamics. So relatable.', author: 'Oscar Martinez', rating: 9, avatar: 'https://avatar.iran.liara.run/public/30', tvShowId_placeholder: 'The Office (US)' },
    { content: 'I love how it evolved from awkward comedy to genuinely heartfelt moments.', author: 'Erin Hannon', rating: 10, tvShowId_placeholder: 'The Office (US)' },
    { content: 'My go-to comfort show. Always cheers me up.', author: 'Gabe Lewis', rating: 10, avatar: 'https://avatar.iran.liara.run/public/41', tvShowId_placeholder: 'The Office (US)' },
    { content: 'Some guest stars felt forced, but the core cast is brilliant.', author: 'Robert California', rating: 7, tvShowId_placeholder: 'The Office (US)' },
    { content: 'The finale was incredibly satisfying. A perfect farewell.', author: 'Creed Bratton', rating: 10, avatar: 'https://avatar.iran.liara.run/public/26', tvShowId_placeholder: 'The Office (US)' },
    { content: 'I appreciate the deep dives into each character\'s personality.', author: 'Phyllis Lapin-Vance', rating: 9, tvShowId_placeholder: 'The Office (US)' },
    { content: 'The pranks between Jim and Dwight are legendary!', author: 'Toby Flenderson', rating: 9, avatar: 'https://avatar.iran.liara.run/public/13', tvShowId_placeholder: 'The Office (US)' },
    { content: 'Hilarious and surprisingly emotional. A true gem.', author: 'Kelly Kapoor', rating: 10, tvShowId_placeholder: 'The Office (US)' },
    { content: 'The relationships feel so real, you get invested.', author: 'Ryan Howard', rating: 8, avatar: 'https://avatar.iran.liara.run/public/1', tvShowId_placeholder: 'The Office (US)' },
    { content: 'I find the show a bit overrated. It has its moments, but not consistently great.', author: 'Jan Levinson', rating: 5, tvShowId_placeholder: 'The Office (US)' },
    { content: 'A fantastic escape from reality. Always makes me laugh.', author: 'Darryl Philbin', rating: 9, avatar: 'https://avatar.iran.liara.run/public/27', tvShowId_placeholder: 'The Office (US)' },
    { content: 'Best sitcom of all time. Period.', author: 'Holly Flax', rating: 10, tvShowId_placeholder: 'The Office (US)' },

    { content: 'Still watching reruns! Timeless humor and great chemistry.', author: 'Joey Tribbiani', rating: 10, avatar: 'https://avatar.iran.liara.run/public/16', tvShowId_placeholder: 'Friends' },
    { content: 'The ultimate comfort show. Perfect for a cozy night in.', author: 'Rachel Green', rating: 9, tvShowId_placeholder: 'Friends' },
    { content: 'Phoebe Buffay is my spirit animal. Her songs are the best!', author: 'Monica Geller', rating: 10, avatar: 'https://avatar.iran.liara.run/public/98', tvShowId_placeholder: 'Friends' },
    { content: 'The storylines are classic sitcom fare, always makes me laugh.', author: 'Chandler Bing', rating: 9, tvShowId_placeholder: 'Friends' },
    { content: 'Some jokes haven\'t aged well, but the core friendship is gold.', author: 'Ross Geller', rating: 7, avatar: 'https://avatar.iran.liara.run/public/43', tvShowId_placeholder: 'Friends' },
    { content: 'I grew up with this show. It feels like home.', author: 'Gunther', rating: 10, tvShowId_placeholder: 'Friends' },
    { content: 'The character arcs are surprisingly strong for a sitcom.', author: 'Janice Litman-Goralnik', rating: 9, avatar: 'https://avatar.iran.liara.run/public/71', tvShowId_placeholder: 'Friends' },
    { content: 'The Thanksgiving episodes are legendary!', author: 'Richard Burke', rating: 10, tvShowId_placeholder: 'Friends' },
    { content: 'A bit unrealistic at times, but it\'s just pure fun.', author: 'Carol Willick', rating: 8, avatar: 'https://avatar.iran.liara.run/public/88', tvShowId_placeholder: 'Friends' },
    { content: 'The emotional moments hit hard too. Not just comedy.', author: 'Mike Hannigan', rating: 9, tvShowId_placeholder: 'Friends' },
    { content: 'Still holds up! A true testament to great writing and chemistry.', author: 'Estelle Leonard', rating: 9, avatar: 'https://avatar.iran.liara.run/public/92', tvShowId_placeholder: 'Friends' },
    { content: 'The best sitcom ever. Period.', author: 'Mr. Heckles', rating: 10, tvShowId_placeholder: 'Friends' },
    { content: 'Love the Central Perk setting. It feels so iconic.', author: 'Ursula Buffay', rating: 8, avatar: 'https://avatar.iran.liara.run/public/85', tvShowId_placeholder: 'Friends' },
    { content: 'Some episodes felt a bit weak, but overall, solid entertainment.', author: 'Paolo', rating: 7, tvShowId_placeholder: 'Friends' },
    { content: 'The banter is top-notch. So many memorable lines!', author: 'Emily Waltham', rating: 9, avatar: 'https://avatar.iran.liara.run/public/96', tvShowId_placeholder: 'Friends' }
  ];

  for (const comment of commentsData) {
    const data: any = {
      content: comment.content,
      author: comment.author,
      rating: comment.rating,
      avatar: comment.avatar || null,
    };

    if (comment.movieId_placeholder) {
      data.movieId = createdMovies[comment.movieId_placeholder];
    } else if (comment.tvShowId_placeholder) {
      data.tvShowId = createdTvShows[comment.tvShowId_placeholder];
    }
    
    if (!data.movieId && !data.tvShowId) {
        console.warn(`Skipping comment for: ${comment.content} as no parent ID found.`);
        continue;
    }

    await prisma.comment.create({ data });
    console.log(`Created comment by ${comment.author} for ${comment.movieId_placeholder || comment.tvShowId_placeholder}`);
    await delay(50);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });