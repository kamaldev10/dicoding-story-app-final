import { convertBase64ToUint8Array } from './index';
import CONFIG from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/story-api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}
// Di notification-helper.js (konsep)
export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    throw new Error('PERMISSION_NOT_GRANTED'); // Lempar error
  }

  try {
    let pushSubscription; // Pindahkan ke dalam try agar lebih aman
    const registration = await navigator.serviceWorker.ready;
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error('subscribe: API response not OK:', response);
      if (pushSubscription) {
        // Pastikan pushSubscription ada
        await pushSubscription.unsubscribe(); // Rollback langganan browser
      }
      throw new Error('SUBSCRIPTION_API_FAILED'); // Lempar error
    }
    // Tidak ada alert sukses di sini, biarkan Presenter yang menangani
    return pushSubscription; // Kembalikan status sukses jika perlu
  } catch (error) {
    console.error('subscribe: error:', error);
    if (pushSubscription && error.message !== 'SUBSCRIPTION_API_FAILED') {
      // Hindari double unsubscribe jika error dari API
      // Hanya unsubscribe jika error bukan dari kegagalan API (yang sudah di-rollback)
      // dan pushSubscription berhasil dibuat
      await pushSubscription.unsubscribe();
    }
    // Lempar ulang error asli atau error yang lebih spesifik
    throw error; // atau throw new Error('SUBSCRIPTION_GENERAL_FAILURE');
  }
}
export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';

  try {
    const pushSubscription = await getPushSubscription();

    if (!pushSubscription) {
      alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
      return;
    }

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      alert(failureUnsubscribeMessage);
      console.error('unsubscribe: response:', response);

      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();

    if (!unsubscribed) {
      console.error('Local unsubscription failed.');

      return;
    }

    alert(successUnsubscribeMessage);
  } catch (error) {
    alert(failureUnsubscribeMessage);
    console.error('unsubscribe: error:', error);
  }
}
