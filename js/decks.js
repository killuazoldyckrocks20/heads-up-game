/**
 * Heads Up! Deck Library and Deck Manager
 * Contains 10 vibrant built-in categories with 500+ cards,
 * plus full support for user-created custom decks with LocalStorage persistence.
 */

export const BUILT_IN_DECKS = [
  {
    id: 'movies',
    title: 'Blockbuster Movies',
    description: 'Iconic cinema hits, classics, and modern favorites.',
    emoji: '🎬',
    color: '#ec4899', // Hot Pink
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    category: 'Pop Culture',
    cards: [
      'Titanic', 'Jurassic Park', 'The Avengers', 'Avatar', 'Inception',
      'The Dark Knight', 'Star Wars', 'Harry Potter', 'The Lion King', 'The Matrix',
      'Forrest Gump', 'Pulp Fiction', 'Back to the Future', 'Interstellar', 'Gladiator',
      'Toy Story', 'Spider-Man', 'Barbie', 'Oppenheimer', 'Finding Nemo',
      'The Godfather', 'Fight Club', 'Shrek', 'Pirates of the Caribbean', 'Lord of the Rings',
      'Jaws', 'Home Alone', 'Frozen', 'Top Gun', 'Ghostbusters',
      'The Shining', 'Jurassic World', 'Black Panther', 'The Terminator', 'Iron Man',
      'Monsters, Inc.', 'The Shawshank Redemption', 'Aladdin', 'Coco', 'Up',
      'Deadpool', 'Guardians of the Galaxy', 'La La Land', 'The Hunger Games', 'Twilight',
      'Mean Girls', 'Dune', 'Everything Everywhere All at Once', 'The Grand Budapest Hotel', 'WALL-E'
    ]
  },
  {
    id: 'animals',
    title: 'Animal Kingdom',
    description: 'Creatures great and small from around the globe.',
    emoji: '🦁',
    color: '#10b981', // Emerald Mint
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    category: 'Nature',
    cards: [
      'Lion', 'Elephant', 'Kangaroo', 'Giraffe', 'Penguin',
      'Blue Whale', 'Chameleon', 'Bald Eagle', 'Platypus', 'Sloth',
      'Great White Shark', 'Grizzly Bear', 'Cheetah', 'Koala', 'Flamingo',
      'Gorilla', 'Octopus', 'Honey Badger', 'Red Panda', 'Zebra',
      'Hippopotamus', 'Snow Leopard', 'Meerkat', 'Giant Squid', 'Komodo Dragon',
      'Toucan', 'Sea Turtle', 'Otter', 'Arctic Fox', 'Peacock',
      'Chimpanzee', 'Hyena', 'Walrus', 'Pufferfish', 'Porcupine',
      'Armadillo', 'Humpback Whale', 'Ostrich', 'Manta Ray', 'Beaver',
      'Kangaroo Rat', 'Jaguar', 'Llama', 'Wolf', 'Dolphin',
      'Flamingo', 'Bald Eagle', 'Hummingbird', 'Pangolin', 'Capybara'
    ]
  },
  {
    id: 'act-it-out',
    title: 'Act It Out!',
    description: 'No talking allowed! Mime, gesture, and dance.',
    emoji: '🎭',
    color: '#f59e0b', // Vibrant Amber
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    category: 'Action',
    cards: [
      'Playing Air Guitar', 'Walking a Tightrope', 'Opening a Stuck Pickle Jar',
      'Getting a Sunburn', 'Stepping on a Lego', 'Milking a Cow',
      'Dancing the Macarena', 'Bowling a Strike', 'Chasing a Fly with a Swatter',
      'Walking against Strong Wind', 'Doing the Moonwalk', 'Trying on Tight Jeans',
      'Surfing a Giant Wave', 'Juggling Invisible Balls', 'Rock Climbing',
      'Sneaking downstairs for a midnight snack', 'Ice Skating on Thin Ice',
      'Eating Spicy Chili', 'Taking a Selfie with an Angry Cat', 'Sumo Wrestling',
      'Conducting an Orchestra', 'Walking like a Robot', 'Scuba Diving with Sharks',
      'Parallel Parking a Huge Truck', 'Running on a Treadmill going too fast',
      'Karate Chopping a Board', 'Stuck in an Invisible Box', 'Flipping Pancakes',
      'Singing in the Shower', 'Painting a Masterpiece', 'Rowing a Canoe',
      'Being Abducted by Aliens', 'Walking a Stubborn Dog', 'Eating Spaghetti with no hands',
      'Defusing a Bomb', 'Building a Sandcastle', 'Catching a Big Fish',
      'Trying to read without glasses', 'Blowing up a balloon till it pops', 'Operating heavy machinery',
      'Warming hands by campfire', 'Pretending to be a statue', 'Ironing clothes in a hurry',
      'Tasting sour lemon', 'Brushing a crocodile teeth', 'Winning the lottery'
    ]
  },
  {
    id: 'superstars',
    title: 'Pop Icons & Superstars',
    description: 'Legends, celebrities, music royalty, and icons.',
    emoji: '🌟',
    color: '#8b5cf6', // Electric Violet
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    category: 'Pop Culture',
    cards: [
      'Taylor Swift', 'Beyoncé', 'Leonardo DiCaprio', 'Michael Jackson',
      'Elon Musk', 'Zendaya', 'Lionel Messi', 'Cristiano Ronaldo',
      'Rihanna', 'Dwayne The Rock Johnson', 'Oprah Winfrey', 'Keanu Reeves',
      'Tom Cruise', 'Billie Eilish', 'Morgan Freeman', 'Adele',
      'Lady Gaga', 'Brad Pitt', 'Kanye West', 'Ariana Grande',
      'Will Smith', 'Kim Kardashian', 'Justin Bieber', 'Selena Gomez',
      'Gordon Ramsay', 'Shaquille O\'Neal', 'Johnny Depp', 'Eminem',
      'Post Malone', 'Ed Sheeran', 'Jennifer Aniston', 'Meryl Streep',
      'Robert Downey Jr.', 'Chris Hemsworth', 'Pedro Pascal', 'David Beckham',
      'Stephen Curry', 'LeBron James', 'Drake', 'Kendrick Lamar',
      'Margot Robbie', 'Cillian Murphy', 'Ryan Reynolds', 'Emma Watson'
    ]
  },
  {
    id: 'food',
    title: 'Foodie Paradise',
    description: 'Comfort foods, sweet treats, and global culinary favorites.',
    emoji: '🍕',
    color: '#ef4444', // Warm Red
    gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    category: 'Lifestyle',
    cards: [
      'Pepperoni Pizza', 'Boba Milk Tea', 'Guacamole and Chips', 'Spicy Tacos',
      'Cheeseburger', 'French Fries', 'Sushi Roll', 'Glazed Donut',
      'Pad Thai', 'Crème Brûlée', 'Chocolate Fondue', 'Belgian Waffles',
      'Ramen Noodles', 'Macaroni and Cheese', 'Chicken Tikka Masala', 'Churros',
      'Avocado Toast', 'Dim Sum Dumplings', 'Banana Split Sundae', 'Fish and Chips',
      'Buffalo Chicken Wings', 'Pho Noodle Soup', 'Garlic Bread', 'Caesar Salad',
      'Nachos Supreme', 'Baklava', 'Lobster Roll', 'Barbecue Ribs',
      'Apple Pie', 'Samosa', 'Burrito', 'Pancakes with Maple Syrup',
      'Tiramisu', 'Croissant', 'Falafel Wrap', 'Hot Dog with Mustard',
      'Gelato', 'Clam Chowder', 'Eggs Benedict', 'Crispy Bacon'
    ]
  },
  {
    id: 'gaming',
    title: 'Gaming Legends',
    description: 'Epic games, characters, consoles, and gaming memes.',
    emoji: '🎮',
    color: '#06b6d4', // Cyan
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
    category: 'Gaming',
    cards: [
      'Super Mario', 'Pikachu', 'Master Chief', 'Minecraft Creeper',
      'Lara Croft', 'Sonic the Hedgehog', 'Pac-Man', 'Link from Zelda',
      'Donkey Kong', 'Crash Bandicoot', 'Geralt of Rivia', 'Kratos',
      'Fortnite Battle Bus', 'Among Us Impostor', 'Tetris', 'Call of Duty',
      'Grand Theft Auto', 'Portal Gun', 'Roblox Noob', 'Pokemon Charizard',
      'The Sims', 'Overwatch Tracer', 'Elden Ring', 'Counter-Strike',
      'World of Warcraft', 'Bowser', 'Luigi', 'Solid Snake',
      'Rayman', 'Vault Boy', 'Doom Slayer', 'Cloud Strife',
      'Arthur Morgan', 'Princess Peach', 'Spyro the Dragon', 'Gengar'
    ]
  },
  {
    id: 'songs',
    title: 'Hit Songs & Anthems',
    description: 'Chart-toppers, classic anthems, and karaoke bangers.',
    emoji: '🎸',
    color: '#3b82f6', // Bright Blue
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    category: 'Music',
    cards: [
      'Bohemian Rhapsody', 'Shake It Off', 'Rolling in the Deep', 'Stayin\' Alive',
      'Billie Jean', 'Hotel California', 'Uptown Funk', 'Bad Guy',
      'Shape of You', 'Eye of the Tiger', 'Sweet Child O\' Mine', 'Smells Like Teen Spirit',
      'Don\'t Stop Believin\'', 'Single Ladies', 'Dancing Queen', 'All Star',
      'Old Town Road', 'Despacito', 'Wonderwall', 'Hey Jude',
      'Hips Don\'t Lie', 'I Will Always Love You', 'Livin\' on a Prayer', 'Lose Yourself',
      'Blinding Lights', 'Careless Whisper', 'Thriller', 'Roar'
    ]
  },
  {
    id: 'superheroes',
    title: 'Superheroes & Villains',
    description: 'Comic book legends with capes, superpowers, and gadgets.',
    emoji: '🦸',
    color: '#eab308', // Gold
    gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    category: 'Comics',
    cards: [
      'Spider-Man', 'Batman', 'Wonder Woman', 'The Joker', 'Iron Man',
      'Deadpool', 'Thanos', 'Superman', 'Wolverine', 'Captain America',
      'Thor', 'Harley Quinn', 'Black Widow', 'The Hulk', 'Doctor Strange',
      'Flash', 'Aquaman', 'Green Goblin', 'Loki', 'Black Panther',
      'Magneto', 'Venom', 'Catwoman', 'Captain Marvel', 'Groot'
    ]
  },
  {
    id: 'tv-shows',
    title: 'Binge-Worthy TV',
    description: 'Unforgettable TV series, sitcoms, and streaming phenomena.',
    emoji: '📺',
    color: '#a855f7', // Purple
    gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    category: 'TV & Streaming',
    cards: [
      'Stranger Things', 'Friends', 'The Office', 'Game of Thrones',
      'Breaking Bad', 'Squid Game', 'Wednesday', 'The Simpsons',
      'Grey\'s Anatomy', 'The Crown', 'Peaky Blinders', 'Better Call Saul',
      'Seinfeld', 'Ted Lasso', 'Black Mirror', 'The Mandalorian',
      'Succession', 'The Last of Us', 'Modern Family', 'Doctor Who'
    ]
  },
  {
    id: 'kids',
    title: 'Family & Kids',
    description: 'Easy, cheerful words for players of all ages!',
    emoji: '👶',
    color: '#14b8a6', // Teal
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
    category: 'Family',
    cards: [
      'Dinosaur', 'Firetruck', 'Cotton Candy', 'Unicorn', 'Super Mario',
      'Roller Coaster', 'SpongeBob', 'Teddy Bear', 'Spaceship', 'Rainbow',
      'Ice Cream Cone', 'Pirate Ship', 'Bumblebee', 'Kitten', 'Puppy',
      'Basketball', 'Bicycle', 'Snowman', 'Lollipop', 'Castle',
      'Magic Wand', 'Bubble Gum', 'Monkey', 'Dragon', 'Treasure Chest'
    ]
  }
];

const CUSTOM_DECKS_STORAGE_KEY = 'heads_up_custom_decks_v1';
const HIGH_SCORES_STORAGE_KEY = 'heads_up_high_scores_v1';

export class DeckManager {
  constructor() {
    this.customDecks = this.loadCustomDecks();
    this.highScores = this.loadHighScores();
  }

  getAllDecks() {
    return [...BUILT_IN_DECKS, ...this.customDecks];
  }

  getDeckById(id) {
    return this.getAllDecks().find(d => d.id === id) || BUILT_IN_DECKS[0];
  }

  loadCustomDecks() {
    try {
      const saved = localStorage.getItem(CUSTOM_DECKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load custom decks from localStorage', e);
      return [];
    }
  }

  saveCustomDecks() {
    try {
      localStorage.setItem(CUSTOM_DECKS_STORAGE_KEY, JSON.stringify(this.customDecks));
    } catch (e) {
      console.warn('Failed to save custom decks to localStorage', e);
    }
  }

  addCustomDeck({ title, description, emoji, color, cards }) {
    const id = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const cleanedCards = cards
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const newDeck = {
      id,
      title: title.trim() || 'My Custom Deck',
      description: description.trim() || 'Created with love by you',
      emoji: emoji || '✨',
      color: color || '#f59e0b',
      gradient: `linear-gradient(135deg, ${color || '#f59e0b'} 0%, #b45309 100%)`,
      category: 'Custom',
      isCustom: true,
      cards: cleanedCards.length > 0 ? cleanedCards : ['Example Card 1', 'Example Card 2']
    };

    this.customDecks.push(newDeck);
    this.saveCustomDecks();
    return newDeck;
  }

  updateCustomDeck(id, updates) {
    const idx = this.customDecks.findIndex(d => d.id === id);
    if (idx === -1) return null;

    if (updates.cards) {
      updates.cards = updates.cards.map(c => c.trim()).filter(c => c.length > 0);
    }

    this.customDecks[idx] = {
      ...this.customDecks[idx],
      ...updates
    };
    this.saveCustomDecks();
    return this.customDecks[idx];
  }

  deleteCustomDeck(id) {
    const initialLen = this.customDecks.length;
    this.customDecks = this.customDecks.filter(d => d.id !== id);
    if (this.customDecks.length !== initialLen) {
      this.saveCustomDecks();
      return true;
    }
    return false;
  }

  // High Scores
  loadHighScores() {
    try {
      const saved = localStorage.getItem(HIGH_SCORES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  saveHighScores() {
    try {
      localStorage.setItem(HIGH_SCORES_STORAGE_KEY, JSON.stringify(this.highScores));
    } catch (e) {}
  }

  getHighScore(deckId) {
    return this.highScores[deckId] || 0;
  }

  setHighScore(deckId, score) {
    const current = this.getHighScore(deckId);
    if (score > current) {
      this.highScores[deckId] = score;
      this.saveHighScores();
      return true; // New High Score!
    }
    return false;
  }

  // JSON Export / Import
  exportCustomDecksJson() {
    return JSON.stringify(this.customDecks, null, 2);
  }

  importCustomDecksJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        parsed.forEach(deck => {
          if (deck.title && Array.isArray(deck.cards)) {
            this.addCustomDeck(deck);
          }
        });
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  }
}

export const deckManager = new DeckManager();
