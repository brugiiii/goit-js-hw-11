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

async function onSubmit(e) {
  try {
    e.preventDefault();
    loadMoreBtn.show();
    loadMoreBtn.disable();
    clearGalleryContainer();
    fetchApiService.resetPage();

    const value = e.currentTarget.elements.searchQuery.value.trim();
    fetchApiService.request = value;

    const photos = await fetchApiService.fetchPhotos();
    if (photos.length === 0 || !value) {
      throw new Error();
    } else if (photos.length < 40) {
      noMorePhotos();
    }

    makeMarkup(photos);
    gallery.refresh();
    loadMoreBtn.enable();

    Notify.success(`Hooray! We found ${photos.length} images.`);
  } catch (error) {
    onError();
  }
}

async function onloadMore() {
  try {
    loadMoreBtn.disable();
    const photos = await fetchApiService.fetchPhotos();
    makeMarkup(photos);
    gallery.refresh();
    loadMoreBtn.enable();

    pageScroll();
  } catch (error) {
    onError();
  }
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
  const cardHeight =
    document.querySelector('.gallery').firstElementChild.offsetHeight;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

export default function noMorePhotos() {
  loadMoreBtn.hide();
  Notify.info("We're sorry, but you've reached the end of search results.");
}
