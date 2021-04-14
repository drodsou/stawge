const sections = document.querySelectorAll('div.screen');
const config = {
  rootMargin: '-50px 0px -55%'
};

let observer = new IntersectionObserver(function (entries, self) {
  entries.forEach(entry => {
    console.log(entry);
    if (entry.isIntersecting) {
      intersectionHandler(entry); 
    }
  });
}, config);

sections.forEach(section => {
  observer.observe(section);
});

function intersectionHandler(entry) {
  const id = entry.target.id;
  const currentlyActive = document.querySelector('nav li.active');
  const shouldBeActive = document.querySelector('nav li[data-ref=' + id + ']');

  if (currentlyActive) {
    currentlyActive.classList.remove('active');
  }
  if (shouldBeActive) {
    shouldBeActive.classList.add('active');
  }
}