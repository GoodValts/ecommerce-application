import { LineItem } from '@commercetools/platform-sdk';
import {
  changeBasketItemAmount,
  getActiveCart,
} from '../model/api/cartApiRoot';
import {
  basketContainer,
  emptyContainer,
  totalCartPrice,
} from '../view/pages/basket/basket';

const centsPerEuro = 100;

export const changeItemAmount = async (e: Event) => {
  const button = e.target as HTMLElement;

  const itemCont = button.closest('.items__item');

  const quantityElem = itemCont?.querySelector('.amount__current');
  const quantity = quantityElem?.textContent;
  let updatedQuantity = 0;
  if (button.textContent === '+') {
    updatedQuantity = Number(quantity) + 1;
  }
  if (button.textContent === '-') {
    updatedQuantity = Number(quantity) - 1;
  }
  const cart = await getActiveCart();
  const { id, version } = cart.body;
  const lineItemId = itemCont?.id || '';
  const actualCart = await changeBasketItemAmount(
    id,
    version,
    lineItemId,
    updatedQuantity,
  );
  if (!actualCart.body.lineItems.length) {
    basketContainer.hidden = true;
    emptyContainer.hidden = false;
    return;
  }

  if (updatedQuantity === 0) {
    itemCont?.remove();
  } else {
    const currentItem = actualCart.body.lineItems.find(
      (el) => el.id === lineItemId,
    ) as LineItem;
    quantityElem!.textContent = `${currentItem?.quantity}`;
    const totalPriceElem = itemCont?.querySelector('.item__total-price');
    totalPriceElem!.textContent = `${
      currentItem.totalPrice.centAmount / centsPerEuro
    }`;
  }

  totalCartPrice.textContent = `${
    actualCart.body.totalPrice.centAmount / centsPerEuro
  } €`;
};
