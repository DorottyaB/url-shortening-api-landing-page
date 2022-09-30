const hamburgerIcon = document.querySelector('.hamburger');
const submitBtn = document.querySelector('button[type="submit"]');
const invalidFeedback = document.querySelector('#invalidFeedback');
const emptyFeedback = document.querySelector('#emptyFeedback');

let links = {};

if (window.innerWidth > 800) {
  const hamburgerIcon = document.querySelector('.hamburger');
  hamburgerIcon.hidden = true;
  const mobileNav = document.querySelector('.nav-items');
  mobileNav.classList.remove('hidden');
}

const updateDOM = () => {
  const container = document.querySelector('.results-container');
  container.textContent = '';

  // Add shortened link cards to DOM
  Object.keys(links).forEach(id => {
    const { original, shortened } = links[id];

    const card = document.createElement('div');
    card.classList.add('result-card');
    const originalLink = document.createElement('p');
    originalLink.classList.add('original-link');
    originalLink.textContent = original;
    const shortenedLink = document.createElement('p');
    shortenedLink.classList.add('shortened-link');
    shortenedLink.textContent = shortened;
    const btn = document.createElement('button');
    btn.classList.add('btn', 'cta-btn', 'copy-btn');
    btn.textContent = 'Copy';
    btn.onclick = copyLink;

    card.append(originalLink, shortenedLink, btn);
    container.appendChild(card);
  });
};

function fetchLinks() {
  // Get links from localStorage if available
  if (localStorage.getItem('links')) {
    links = JSON.parse(localStorage.getItem('links'));
  }
  updateDOM();
}

const shortenLink = async url => {
  const response = await fetch(`https://api.shrtco.de/v2/shorten/?url=${url}`);
  const data = await response.json();
  if (data.error_code === 2) {
    invalidFeedback.style.display = 'inline-block';
  } else if (data.error_code === 1) {
    emptyFeedback.style.display = 'inline-block';
  } else {
    const link = {
      original: url,
      shortened: data.result.full_short_link,
    };
    links[url] = link;
    // Set links in localStorage, fetch, reset form
    localStorage.setItem('links', JSON.stringify(links));
    fetchLinks();
    document.querySelector('#form').reset();
  }
};

const getInput = e => {
  e.preventDefault();
  const input = document.querySelector('#link-input').value;
  shortenLink(input);
};

const copyLink = e => {
  const copyBtns = document.querySelectorAll('.copy-btn');
  if (copyBtns.length > 1) {
    copyBtns.forEach(btn => {
      if (e.target !== btn) {
        btn.style.backgroundColor = 'hsl(180, 66%, 49%)';
        btn.textContent = 'Copy';
      }
    });
  }

  const container = e.target.parentNode;
  const link = container.querySelector('.shortened-link');
  /* Copy the text inside the text field */
  navigator.clipboard.writeText(link.textContent);

  e.target.style.backgroundColor = 'hsl(257, 27%, 26%)';
  e.target.textContent = 'Copied!';
};

// hide error messages when the user starts typing
document.querySelector('#link-input').addEventListener('input', () => {
  invalidFeedback.style.display = 'none';
  emptyFeedback.style.display = 'none';
});

submitBtn.addEventListener('click', getInput);

hamburgerIcon.addEventListener('click', () => {
  const mobileNav = document.querySelector('.nav-items');
  mobileNav.classList.toggle('hidden');
});

// On load
fetchLinks();
