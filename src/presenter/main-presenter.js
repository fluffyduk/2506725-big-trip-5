import PointView from '../view/point-view.js';
import PointsList from '../view/points-list-view.js';
import CreateForm from '../view/create-form-view.js';
import EditForm from '../view/edit-form-view.js';
import { render, replace } from '../framework/render.js';

export default class Presenter {
  createFormViewComponent = new CreateForm();
  pointsListViewComponent = new PointsList();

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.container = container;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    const points = this.pointsModel.getPoints();
    const destinations = this.destinationsModel.getDestinations();
    const offers = this.offersModel.getOffers();
    render(this.pointsListViewComponent, this.container);
    // render(this.createFormViewComponent, this.pointsListViewComponent.element);
    for (const point of points) {
      this.#renderPoint(point, destinations, offers);
    }
  }

  #renderPoint(point, destinations, offers) {
    const onEscKeyDownClose = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditForm();
        document.removeEventListener('keydown', onEscKeyDownClose);
      }
    };

    const pointElement = new PointView(point, destinations, offers, () => {
      replacePoint();
      document.addEventListener('keydown', onEscKeyDownClose);
    });
    const editFormElement = new EditForm(point, destinations, offers, () => {
      replaceEditForm();
      document.removeEventListener('keydown', onEscKeyDownClose);
    });

    function replacePoint() {
      replace(editFormElement, pointElement);
    }

    function replaceEditForm() {
      replace(pointElement, editFormElement);
    }

    render(pointElement, this.pointsListViewComponent.element);
  }
}
