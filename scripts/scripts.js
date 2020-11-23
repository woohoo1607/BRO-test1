window.addEventListener('load', () => {
  initial('root');
});

const initial = (parentId) => {
  const size = 4;
  const squareSize = 60;
  const root = document.getElementById(parentId);
  const headerRoot = createElement('div', 'header-root');
  const bodyRoot = createElement('div', 'body-root');
  const footerRoot = createElement('div', 'footer-root');
  const leftBodyRoot = createElement('div', 'left-body-root');
  const rightBodyRoot = createElement('div', 'right-body-root');
  const table = createElement('table', '', 'table');
  const tbody = createElement('tbody', '');
  const addColumnBtn = createElement('button', 'item button add-button');
  const addLineBtn = createElement('button', 'item button add-button');

  const deleteLine = createDeleteBtn(leftBodyRoot, tbody, false, headerRoot, squareSize);
  const deleteColumn = createDeleteBtn(headerRoot, tbody, true, leftBodyRoot, squareSize);

  for (let i = 0; i < size; i++) {
    const line = createElement('tr', 'line');
    for (let j = 0; j < size; j++) {
      const item = createElement('td', 'item')
      addElement(line, item)
    }
    addElement(tbody, line);
  }

  addColumnBtn.addEventListener('click', () => {
    for (let i = 0; i < tbody.childNodes.length; i++) {
      addElement(tbody.childNodes[i], createElement('td', 'item'))
    }
  });

  addLineBtn.addEventListener('click', () => {
    const line = createElement('tr', 'line');
    for (let j = 0; j < tbody.childNodes[0].childNodes.length; j++) {
      const item = createElement('td', 'item')
      addElement(line, item)
    }
    addElement(tbody, line);
  });

  addElement(rightBodyRoot, addColumnBtn);
  addElement(footerRoot, addLineBtn);
  addElement(table, tbody);
  addElement(bodyRoot, leftBodyRoot);
  addElement(bodyRoot, table);
  addElement(bodyRoot, rightBodyRoot);
  addElement(root, headerRoot);
  addElement(root, bodyRoot);
  addElement(root, footerRoot);

  root.addEventListener('mouseout', (e) => {
    const el = e.relatedTarget;
    if (el) {
      const isItem = !!el.classList.value.split(' ').find(el => el === 'item');
      if (isItem) {
        const line = el.parentNode;
        const isLine = !!el.parentNode.classList.value.split(' ').find(el => el === 'line');
        if (isLine) {
          const [cellIndex, cellLength] = findIndex(el);
          const [lineIndex, lineLength] = findIndex(line);
          deleteLine.style = lineLength > 1 ? `top: ${lineIndex*squareSize}px; visibility: visible` : changeStatusDeleteBtn(deleteLine, false);
          deleteColumn.style = cellLength > 1 ?`left: ${cellIndex*squareSize}px; visibility: visible` : changeStatusDeleteBtn(deleteColumn, false);
        }
      } else {
        if (el.parentNode === document) {
          changeStatusDeleteBtn(deleteColumn, false);
          changeStatusDeleteBtn(deleteLine, false);
          return
        }

        const isBodyRootParent = !!el.parentNode.classList.value.split(' ').find(el => el === 'body-root');
        if (el === null || el.parentNode.id === parentId || isBodyRootParent && el.id !== 'table' || el.id === parentId) {
          changeStatusDeleteBtn(deleteColumn, false);
          changeStatusDeleteBtn(deleteLine, false);
        }
      }
    } else {
      changeStatusDeleteBtn(deleteColumn, false);
      changeStatusDeleteBtn(deleteLine, false);
    }
  });

};

const createElement = (tagName, className, idName) => {
  const element = document.createElement(tagName)
  if (className) {
    const classNames = className.split(' ').filter(Boolean);
    element.classList.add(...classNames);
  }
  if (idName) {
    element.id = idName;
  }
  return element;
};

const addElement = (parent, element) => {
  parent.append(element);
};

const findIndex = (element) => {
  for (let i = 0; i < element.parentNode.childNodes.length; i++) {
    if (element.parentNode.childNodes[i] === element) {
      return [i, element.parentNode.childNodes.length]
    }
  }
};

const changeStatusDeleteBtn = (btn, isVisible = false) => {
  if (isVisible) {
    btn.style = 'visibility: visible';
  } else {
    btn.style = 'visibility: hidden';
  }
};

const createDeleteBtn = (parent, tbody, isDeleteColumn, otherDeleteBtn, squareSize) => {
  const deleteBtn = createElement('button', 'item button delete-button');
  const index = indexForDeleteBtn(deleteBtn, squareSize);
  if (isDeleteColumn) {
    deleteBtn.addEventListener('click', deleteColumn(tbody, deleteBtn, otherDeleteBtn, index));
  } else {
    deleteBtn.addEventListener('click', deleteLine(tbody, deleteBtn, otherDeleteBtn, index));
  }
  addElement(parent, deleteBtn);
  return deleteBtn;
};

const deleteColumn = (tbody, btn, otherDeleteBtnParent, index) => () => {
  for (let i = 0; i < tbody.childNodes.length; i++) {
    const itemToRemove = tbody.childNodes[i].childNodes[index];
    tbody.childNodes[i].removeChild(itemToRemove);
  }
  changeStatusDeleteBtn(otherDeleteBtnParent.childNodes[0], false);
  changeStatusDeleteBtn(btn, false);
};

const deleteLine = (tbody, btn, otherDeleteBtnParent, index) => () => {
  tbody.removeChild(tbody.childNodes[index]);
  changeStatusDeleteBtn(otherDeleteBtnParent.childNodes[0]);
  changeStatusDeleteBtn(btn, false);
};

const indexForDeleteBtn = (btn, squareSize) => {
  const shift =  btn.style.left.split('px')[0];
  return shift ? shift/squareSize : 0;
};
