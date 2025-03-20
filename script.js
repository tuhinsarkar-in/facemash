const votes = {};
const initialScore = 1400;
const kFactor = 32; // K-factor for Elo rating system

// Define male and female image arrays
const males = [
  'images/person15.jpg', 'images/person16.jpg', 'images/person17.jpg', 'images/person18.jpg',
  'images/person19.jpg', 'images/person20.jpg', 'images/person21.jpg', 'images/person22.jpg', 'images/person23.jpg', 'images/person24.jpg', 'images/person25.jpg', 'images/person26.jpg', 'images/person27.jpg', 'images/person28.jpg', 'images/person29.jpg', 'images/person30.jpg', 'images/person31.jpg', 'images/person32.jpg', 'images/person33.jpg', 'images/person34.jpg'
];

const females = [
  'images/person0.jpg', 'images/person1.jpg', 'images/person2.jpg', 'images/person3.jpg', 'images/person4.jpg',
  'images/person5.jpg', 'images/person6.jpg', 'images/person7.jpg', 'images/person8.jpg', 'images/person9.jpg', 'images/person10.jpg', 'images/person11.jpg', 'images/person12.jpg', 'images/person13.jpg', 'images/person14.jpg'
];

// Combine all images into one list for easier management
const allImages = [...males, ...females];

// Initialize votes for all images
allImages.forEach(img => {
  votes[img] = initialScore; // Initialize each image with the default score
});

// DOM elements
const leftImage = document.querySelector('#left-image img');
const rightImage = document.querySelector('#right-image img');
const leftVotesDisplay = document.querySelector('#left-image .votes');
const rightVotesDisplay = document.querySelector('#right-image .votes');
const leaderboardContainer = document.getElementById('leaderboard');

// Helper function to ensure consistent keys
function getImageKey(src) {
  if (!src) return null; // Prevent null or undefined keys
  return src.substring(src.indexOf('images/')); // Extract path starting from "images/"
}

// Elo rating calculation
function eloRating(winner, loser) {
  const expectedWin = 1 / (1 + Math.pow(10, (votes[loser] - votes[winner]) / 400));
  votes[winner] += Math.round(kFactor * (1 - expectedWin));
  votes[loser] -= Math.round(kFactor * expectedWin);
}

// Update leaderboard
function updateLeaderboard() {
  leaderboardContainer.innerHTML = ''; // Clear previous leaderboard
  const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]); // Sort by score
  sorted.forEach(([img, score]) => {
    if (!img) return; // Skip invalid entries
    const item = document.createElement('div');
    item.classList.add('leaderboard-item');
    item.innerHTML = `<img src="${img}" class="leaderboard-image" alt="Leaderboard Image"><p>${score} pts</p>`;
    leaderboardContainer.appendChild(item);
  });
}

// Update vote display
function updateVotes() {
  const leftKey = getImageKey(leftImage.src);
  const rightKey = getImageKey(rightImage.src);
  leftVotesDisplay.textContent = `Votes: ${votes[leftKey] || 0}`;
  rightVotesDisplay.textContent = `Votes: ${votes[rightKey] || 0}`;
}

// Swap images for voting
function swapImages(group) {
  if (group.length < 2) {
    alert("No more images to compare in this group!");
    return;
  }

  let img1, img2;

  do {
    img1 = group[Math.floor(Math.random() * group.length)];
    img2 = group[Math.floor(Math.random() * group.length)];
  } while (img1 === img2 || img1 === leftImage.src || img2 === rightImage.src);

  leftImage.src = img1;
  rightImage.src = img2;

  updateVotes();
}

// Event listeners for image clicks
leftImage.parentElement.addEventListener('click', () => {
  const winner = getImageKey(leftImage.src);
  const loser = getImageKey(rightImage.src);
  eloRating(winner, loser);
  updateLeaderboard();
  swapImages(leftImage.src.includes('person1') ? females : males);
});

rightImage.parentElement.addEventListener('click', () => {
  const winner = getImageKey(rightImage.src);
  const loser = getImageKey(leftImage.src);
  eloRating(winner, loser);
  updateLeaderboard();
  swapImages(rightImage.src.includes('person1') ? females : males);
});

// Initial setup
updateLeaderboard();
swapImages(females);
