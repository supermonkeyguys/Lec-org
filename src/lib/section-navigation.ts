const interactiveSelector = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "[contenteditable='true']",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
].join(",");

function isScrollable(element: HTMLElement) {
  const { overflowY } = window.getComputedStyle(element);
  return /(auto|scroll|overlay)/.test(overflowY) && element.scrollHeight > element.clientHeight;
}

export function shouldPreserveNativeScroll(
  root: HTMLElement,
  target: EventTarget | null,
  deltaY: number,
) {
  if (!(target instanceof Element) || !root.contains(target)) return true;

  const interactive = target.closest(interactiveSelector);
  if (interactive && root.contains(interactive)) return true;

  let current: HTMLElement | null =
    target instanceof HTMLElement ? target : target.parentElement;

  while (current && current !== root) {
    if (isScrollable(current)) {
      const canScrollDown = current.scrollTop + current.clientHeight < current.scrollHeight - 1;
      const canScrollUp = current.scrollTop > 0;
      if ((deltaY > 0 && canScrollDown) || (deltaY < 0 && canScrollUp)) return true;
    }

    if (current.parentElement === root && current.offsetHeight > root.clientHeight) {
      const canScrollDown =
        root.scrollTop + root.clientHeight < current.offsetTop + current.offsetHeight - 1;
      const canScrollUp = root.scrollTop > current.offsetTop;
      if ((deltaY > 0 && canScrollDown) || (deltaY < 0 && canScrollUp)) return true;
    }

    current = current.parentElement;
  }

  return false;
}

export function closestSectionIndex(
  root: HTMLElement,
  sectionElements: HTMLElement[],
) {
  return sectionElements.reduce((closestIndex, section, index) => {
    const closestDistance = Math.abs(
      sectionElements[closestIndex].offsetTop - root.scrollTop,
    );
    const distance = Math.abs(section.offsetTop - root.scrollTop);
    return distance < closestDistance ? index : closestIndex;
  }, 0);
}
