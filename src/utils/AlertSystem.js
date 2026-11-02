export default class AlertSystem {
  constructor() {
    this.audioContext = null;
    this.isAlertActive = false;
    this.lastAlertTime = 0;
    this.alertCooldown = 3000;
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  playAlertSound() {
    const now = Date.now();
    if (this.isAlertActive || now - this.lastAlertTime < this.alertCooldown) { return; }
    this.initAudioContext();
    this.isAlertActive = true;
    this.lastAlertTime = now;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
    setTimeout(() => { this.isAlertActive = false; }, this.alertCooldown);
  }
  async showNotification(missingPPE) {
    if (!("Notification" in window)) { return; }
    if (Notification.permission === "granted") {
      new Notification("⚠️ PPE Violation Detected!", {
        body: `Missing PPE: ${missingPPE.join(', ')}`,
        icon: '/ppe-icon.png', badge: '/badge-icon.png', tag: 'ppe-violation', requireInteraction: true, vibrate: [200,100,200]
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.showNotification(missingPPE);
      }
    }
  }
  triggerAlert(missingPPE) {
    this.playAlertSound(); this.showNotification(missingPPE);
  }
  destroy() {
    if (this.audioContext) { this.audioContext.close(); }
  }
}
