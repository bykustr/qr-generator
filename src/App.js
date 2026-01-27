import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Link, MessageSquare, User, Download, Copy, Check, Globe } from 'lucide-react';

const TRANSLATIONS = {
  "tr-TR": {
    "appTitle": "QR Kod Oluşturucu",
    // ... (artifact'teki tüm çeviri kodları)
  },
  "en-US": {
    "appTitle": "QR Code Generator",
    // ... (artifact'teki tüm çeviri kodları)
  }
};

const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'tr-TR';
};

const QRCodeGenerator = () => {
  // ... (artifact'teki tüm component kodu)
};

export default QRCodeGenerator;
