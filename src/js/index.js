import '../styles/styles.css';
import FetchApiService from './fetchApiService';
import cardMarkup from '../templates/cardMarkup.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadMoreButton from './loadMoreBtn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('form'),
  galleryContainerEl: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('[data-action="load-more"]'),
};
const fetchApiService = new FetchApiService();
const loadMoreBtn = new LoadMoreButton({
  selector: '[data-action="load-more"]',
  hidden: true,
});
let gallery = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', onloadMore);

function onSubmit(e) {
  e.preventDefault();

  const value = e.currentTarget.elements.searchQuery.value;
  fetchApiService.request = value.trim();

  loadMoreBtn.show();
  loadMoreBtn.disable();

  fetchApiService.resetPage();

  clearGalleryContainer();

  fetchApiService
    .fetchPhotos()
    .then(res => {
      if (res.length === 0 || !value) {
        throw new Error();
      }

      makeMarkup(res);
      gallery.refresh();
      loadMoreBtn.enable();

      Notify.success(`Hooray! We found ${res.length} images.`);
    })
    .catch(onError);
}

function onloadMore() {
  loadMoreBtn.disable();
  fetchApiService.fetchPhotos().then(res => {
    makeMarkup(res);
    pageScroll();
    gallery.refresh();
    loadMoreBtn.enable();
  });
}

function makeMarkup(res) {
  refs.galleryContainerEl.insertAdjacentHTML('beforeend', cardMarkup(res));
}

function clearGalleryContainer() {
  refs.galleryContainerEl.innerHTML = '';
}

function onError() {
  loadMoreBtn.hide();
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function pageScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
