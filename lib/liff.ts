'use client';

import liff from '@line/liff';

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || '';

export async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });
    return true;
  } catch (error) {
    console.error('LIFF init error:', error);
    return false;
  }
}

export function isLoggedIn() {
  return liff.isLoggedIn();
}

export function login() {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

export function logout() {
  if (liff.isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
}

export async function getProfile() {
  if (!liff.isLoggedIn()) {
    return null;
  }
  
  try {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

export async function getAccessToken() {
  if (!liff.isLoggedIn()) {
    return null;
  }
  return liff.getAccessToken();
}

export function isInClient() {
  return liff.isInClient();
}

export function closeWindow() {
  liff.closeWindow();
}

export function sendMessages(messages: { type: 'text'; text: string }[]) {
  if (liff.isInClient()) {
    return liff.sendMessages(messages);
  }
  return Promise.reject(new Error('Not in LINE client'));
}
