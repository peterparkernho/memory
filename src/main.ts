import './style.css';
// import './data'
import { Message } from './types/global';
import { COLOR_PALETTES } from './constants'


interface Styles extends CSSStyleDeclaration {
  [key: string]: any
}

const getColorPalettes = (seed: number) => {
  return COLOR_PALETTES[seed] || []
}

const getElement = (target: string) => {
  return document.getElementById(target);
}

const setCssProperties = (target: string | HTMLElement, styles: Partial<Styles>) => {
  let element;
  if (typeof target === 'string') {
    element = getElement(target);
  } else {
    element = target;
  }
  
  if (element) {
    for (const property in styles) {
      element.style[property as any] = styles[property];
    }
  }
}

let view: 'Brief' | 'History' = 'Brief';

const showBrief = () => {
  view = 'Brief';
  setCssProperties('chat-conversation', {
    display: 'none'
  });
  setCssProperties('chat-brief', {
    display: 'flex'
  });
  getElement('guide-change-view')!.innerText = "press (i) to show  history";
}

const showHistory = () => {
  view = "History";
  setCssProperties('chat-brief', {
    display: 'none'
  });
  setCssProperties('chat-conversation', {
    display: 'flex'
  });
  getElement('guide-change-view')!.innerText = "press ( i ) to GO BACK";
}

const createMessageItem = (message: Message) => {
  const item = document.createElement('div');
  item.classList.add('conversation__item');
  item.innerHTML = `
    <div class="conversation__item__info">
      <span class="conversation__item__info__user list-sender">${message.user}:</span>
      <span class="conversation__item__info__time list-created-at">${message.createdAt}</span>
    </div>
    <div class="conversation__item__message list-chat-message">
      ${message.message}
    </div>
  `;
  getElement('chat-conversation')!.append(item);
}

const applyColor = () => {
  const colors = getColorPalettes(window.seed);

  if (colors.length) {
    const header = document.getElementById('heading');
    if (header) {
      setCssProperties(header as HTMLDivElement, {
        color: colors[6],
      });
    }

    const briefTime = document.getElementById('brief-time');
    if (briefTime) {
      setCssProperties(briefTime as HTMLDivElement, {
        color: colors[7],
      });
    }

    const sender = document.getElementById('brief-heading-username');
    if (sender) {
      setCssProperties(sender as HTMLDivElement, {
        color: colors[8],
      });
    }

    const replyLabel = document.getElementById('brief-replyto-user');
    if (replyLabel) {
      setCssProperties(replyLabel as HTMLDivElement, {
        color: colors[9],
      });
    }
    const replyMessage = document.getElementById('brief-replyto-message');
    if (replyMessage) {
      setCssProperties(replyMessage as HTMLDivElement, {
        color: colors[10],
        backgroundColor: colors[11],
      });
    }

    const guideSave = document.getElementById('guide-save');
    if (guideSave) {
      setCssProperties(guideSave as HTMLDivElement, {
        color: colors[12],
      });
    }
    const guideChangeView = document.getElementById('guide-change-view');
    if (guideChangeView) {
      setCssProperties(guideChangeView as HTMLDivElement, {
        color: colors[12],
      });
    }
    

    const textElements = document.getElementsByClassName('text-color');
    for (const element of textElements) {
      setCssProperties(element as HTMLDivElement, {
        color: colors[0],
      });
    }

    const boxElements = document.getElementsByClassName('box-color');
    for (const element of boxElements) {
      setCssProperties(element as HTMLDivElement, {
        borderColor: colors[5],
      });
    }

    const backgroundElements = document.getElementsByClassName('background-color');
    for (const element of backgroundElements) {
      setCssProperties(element as HTMLDivElement, {
        backgroundColor: colors[1],
      });
    }

    const dateElements = document.getElementsByClassName('list-created-at');
    for (const element of dateElements) {
      setCssProperties(element as HTMLDivElement, {
        color: colors[14],
      });
    }

    const userElements = document.getElementsByClassName('list-sender');
    for (const element of userElements) {
      setCssProperties(element as HTMLDivElement, {
        color: colors[13],
      });
    }

    const chatMessages = document.getElementsByClassName('list-chat-message');
    for (const element of chatMessages) {
      setCssProperties(element as HTMLDivElement, {
        color: colors[15],
      });
    }
  }
}

const createMessageDom = () => {
  try {
    // write data
    document.title = window.collectionName;
    getElement('heading')!.innerText = window.collectionName;

    // create brief
    getElement('brief-heading-username')!.innerText = `${window.brief.item.user}`;
    getElement('brief-time')!.innerText = `${window.brief.item.createdAt} @ ${window.circleInfo.name}`;
    getElement('brief-message')!.innerText = `"${window.brief.item.message}"`;

    if (window.brief.replyTo) {
      setCssProperties('brief-replyto', {
        display: 'flex',
      });
      getElement('brief-replyto-user')!.innerText = `Replied to ${window.brief.replyTo.user}`
      getElement('brief-replyto-message')!.innerText = `${window.brief.replyTo.message}`
    }
    // create histories
    window.histories.forEach(message => createMessageItem(message));
  } catch (e) {
    //
  }
}

const resizeWindow = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  setCssProperties('box-container', {
    width: 'unset',
    height: 'unset',
    display: 'flex'
  });

  if (width <= height) {
    setCssProperties('box-container', {
      width: `${width}px`,
      height: `${width}px`
    });
  } else {
    setCssProperties('box-container', {
      width: `${height}px`,
      height: `${height}px`
    });
  }
}

// set dimension
document.addEventListener('DOMContentLoaded', () => {
  // @ts-ignore
  document.oncontextmenu = new Function("return false;")
  resizeWindow();
  setCssProperties('app', {
    display: 'flex',
  });

  window.collectionName = window.collectionName || '';
  createMessageDom();
  applyColor();
  showBrief();
});

document.addEventListener('keypress', (event) => {
  const { code } = event;
  if (code === 'KeyI') {
    // change view
    if (view === 'Brief') {
      showHistory();
    } else {
      showBrief();
    }
  } else if (code === 'KeyS') {
    // save to svg
    if (window.domtoimage) {
      window.domtoimage.toSvg(document.getElementById('app') as HTMLDivElement).then(dataUrl => {
        const link = document.createElement('a');
        link.setAttribute('href', dataUrl);
        link.setAttribute('download', 'memories#1');
        link.click();
      })
    }
  }
})

window.addEventListener('resize', () => {
  resizeWindow();
})