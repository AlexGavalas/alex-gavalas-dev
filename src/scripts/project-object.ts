// CSS handles the six faces; this controller only rotates their shared parent.
// No render loop runs while the object is at rest.
export function initProjectObject(exhibit: HTMLElement) {
  if (exhibit.dataset.initialized) return;
  const stage = exhibit.querySelector<HTMLElement>('[data-object-stage]');
  const object = exhibit.querySelector<HTMLElement>('[data-project-object]');
  const controls = exhibit.querySelector<HTMLElement>('[data-object-controls]');
  const status = exhibit.querySelector<HTMLElement>('[data-object-status]');
  if (!stage || !object || !controls || !status) return;
  exhibit.dataset.initialized = 'true';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let x = -12;
  let y = -24;
  let targetX = x;
  let targetY = y;
  let velocityX = 0;
  let velocityY = 0;
  let frame = 0;
  let lastTime = 0;
  let notifyChanges = true;
  let pointer: { id: number; startX: number; startY: number; rotationX: number; rotationY: number; dragging: boolean } | undefined;

  function render() {
    object!.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(-7deg)`;
    const facing = Math.cos(y * Math.PI / 180) >= 0 ? 'front' : 'back';
    const changed = stage!.dataset.facing !== facing;
    stage!.dataset.facing = facing;
    // Programmatic selection already updated the tab. Only gestures and object
    // controls publish changes, so a spring reversal cannot fight a newer tab.
    if (changed && notifyChanges) exhibit.dispatchEvent(new CustomEvent('project-object:change', { detail: { index: facing === 'front' ? 0 : 1 } }));
  }

  function announce() {
    status!.textContent = stage!.dataset.facing === 'front'
      ? 'HabitThread face. Turn over for Learning Path.'
      : 'Learning Path face. Turn over for HabitThread.';
  }

  function settle() {
    cancelAnimationFrame(frame);
    frame = 0;
    x = targetX;
    y = targetY;
    velocityX = velocityY = 0;
    // Keep repeated turns numerically small, without changing orientation.
    const turns = Math.round((y + 24) / 360);
    y -= turns * 360;
    targetY = y;
    render();
    // An interrupted turn can finish on its original face without crossing the
    // edge again. Publish that final face too, so the details cannot stay stale.
    if (notifyChanges) exhibit.dispatchEvent(new CustomEvent('project-object:change', { detail: { index: stage!.dataset.facing === 'front' ? 0 : 1 } }));
    announce();
    stage!.dataset.moving = 'false';
  }

  function tick(time: number) {
    let remaining = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    // Small integration steps keep the spring stable on slow and fast displays.
    while (remaining > 0) {
      const step = Math.min(remaining, 1 / 120);
      velocityX += ((targetX - x) * 190 - velocityX * 25) * step;
      velocityY += ((targetY - y) * 190 - velocityY * 25) * step;
      x += velocityX * step;
      y += velocityY * step;
      remaining -= step;
    }
    render();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) < 0.02
      && Math.abs(velocityX) + Math.abs(velocityY) < 0.05 && !pointer?.dragging) {
      settle();
    } else {
      frame = requestAnimationFrame(tick);
    }
  }

  function move(animate: boolean) {
    if (reducedMotion.matches || !animate || document.hidden) {
      settle();
      return;
    }
    stage!.dataset.moving = 'true';
    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  function reset(animate: boolean) {
    notifyChanges = true;
    pointer = undefined;
    stage!.dataset.dragging = 'false';
    targetX = -12;
    targetY = Math.round((y + 24) / 360) * 360 - 24;
    move(animate);
  }

  stage.tabIndex = 0;
  stage.dataset.interactive = 'true';
  const help = exhibit.querySelector('[data-object-help]');
  if (help) help.textContent = 'Drag sideways to turn · Arrow keys to rotate · Home to reset';
  controls.hidden = false;
  render();
  announce();

  stage.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || pointer) return;
    notifyChanges = true;
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, rotationX: targetX, rotationY: targetY, dragging: false };
    // Let the browser recognize vertical page scrolling before capturing touch.
    if (event.pointerType === 'mouse') stage.focus({ preventScroll: true });
  });

  stage.addEventListener('pointermove', (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    if (!pointer.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 5) return;
      if (event.pointerType !== 'mouse' && Math.abs(dy) > Math.abs(dx)) {
        pointer = undefined;
        return;
      }
      pointer.dragging = true;
      stage.setPointerCapture(event.pointerId);
      stage.dataset.dragging = 'true';
    }
    targetY = pointer.rotationY + dx * 0.65;
    // Bounded tilt keeps the object upright; horizontal rotation is unrestricted.
    targetX = Math.max(-34, Math.min(34, pointer.rotationX - dy * 0.16));
    move(true);
  });

  function release(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const id = pointer.id;
    pointer = undefined;
    stage!.dataset.dragging = 'false';
    if (stage!.hasPointerCapture(id)) stage!.releasePointerCapture(id);
    move(true);
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', release);
  stage.addEventListener('pointerleave', (event) => {
    if (pointer && !pointer.dragging) release(event);
  });

  controls.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!button) return;
    notifyChanges = true;
    const animate = event.detail > 0;
    if (button.dataset.action === 'reset') return reset(animate);
    if (button.dataset.action === 'flip') {
      targetY = (Math.round((targetY + 24) / 180) + 1) * 180 - 24;
      targetX = -12;
    } else {
      targetY += button.dataset.action === 'left' ? -30 : 30;
    }
    move(animate);
  });

  stage.addEventListener('keydown', (event) => {
    notifyChanges = true;
    if (event.key === 'ArrowLeft') targetY -= 20;
    else if (event.key === 'ArrowRight') targetY += 20;
    else if (event.key === 'ArrowUp') targetX = Math.min(34, targetX + 8);
    else if (event.key === 'ArrowDown') targetX = Math.max(-34, targetX - 8);
    else if (event.key === 'Home' || event.key === 'Escape') {
      event.preventDefault();
      reset(false);
      return;
    } else return;
    event.preventDefault();
    move(false);
  });

  exhibit.addEventListener('project-object:select', (event) => {
    const { index, animate } = (event as CustomEvent<{ index: number; animate: boolean }>).detail;
    if (index !== 0 && index !== 1) return;
    notifyChanges = false;
    targetX = -12;
    const faceAngle = index * 180 - 24;
    targetY = faceAngle + Math.round((y - faceAngle) / 360) * 360;
    move(animate);
  });

  // Pause even mid-gesture; returning to the tab never starts idle animation.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset(false);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) settle();
  });
}
