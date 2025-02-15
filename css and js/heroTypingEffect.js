document.addEventListener('DOMContentLoaded', () => {
  const heroText = document.getElementById('heroTyping');
  const messages = [
    "Discover my Projects, Skills and the journey behind them",
    "Learn more about me and my passion for coding",
  ];
  let messageIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < messages[messageIndex].length) {
      heroText.textContent += messages[messageIndex].charAt(charIndex++);
      setTimeout(type, 100);
    } else {
      setTimeout(erase, 1500);
    }
  }
  function erase() {
    if (charIndex > 0) {
      heroText.textContent = messages[messageIndex].substring(0, --charIndex);
      setTimeout(erase, 50);
    } else {
      messageIndex = (messageIndex + 1) % messages.length;
      setTimeout(type, 800);
    }
  }
  type();
});
