import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Link, User, Download, Copy, Check, Globe } from 'lucide-react';

const TRANSLATIONS = {
  "tr-TR": {
    "appTitle": "QR Kod Oluşturucu",
    "appDescription": "URL'ler ve iletişim bilgileri için QR kodları oluşturun",
    "urlTab": "URL",
    "contactTab": "İletişim",
    "enterUrl": "URL Girin",
    "contactInformation": "İletişim Bilgileri",
    "websiteUrl": "Web Sitesi URL'si",
    "urlPlaceholder": "ornek.com veya https://ornek.com",
    "urlHelp": "Bir web sitesi URL'si girin. http:// eklemezseniz, otomatik olarak https:// ekleyeceğiz.",
    "firstName": "Ad",
    "firstNamePlaceholder": "Ahmet",
    "lastName": "Soyad",
    "lastNamePlaceholder": "Yılmaz",
    "phoneNumber": "Telefon Numarası",
    "phonePlaceholder": "+90 (555) 123-4567",
    "emailAddress": "E-posta Adresi",
    "emailPlaceholder": "ahmet.yilmaz@ornek.com",
    "organization": "Organizasyon",
    "organizationPlaceholder": "Şirket Adı",
    "website": "Web Sitesi",
    "websitePlaceholder": "https://ornek.com",
    "clearAllFields": "Tüm Alanları Temizle",
    "generatedQrCode": "Oluşturulan QR Kod",
    "scanQrCode": "Bu QR kodunu cihazınızla tarayın",
    "fillFormPrompt": "QR kodunuzu oluşturmak için formu doldurun",
    "download": "İndir",
    "copyData": "Veriyi Kopyala",
    "copied": "Kopyalandı!",
    "qrCodeData": "QR Kod Verisi:",
    "footerText": "Anında QR kodları oluşturun • Veri saklanmaz • Ücretsiz kullanım",
    "qrCodeAlt": "Oluşturulan QR Kod"
  },
  "en-US": {
    "appTitle": "QR Code Generator",
    "appDescription": "Generate QR codes for URLs and contact information",
    "urlTab": "URL",
    "contactTab": "Contact",
    "enterUrl": "Enter URL",
    "contactInformation": "Contact Information",
    "websiteUrl": "Website URL",
    "urlPlaceholder": "example.com or https://example.com",
    "urlHelp": "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
    "firstName": "First Name",
    "firstNamePlaceholder": "John",
    "lastName": "Last Name",
    "lastNamePlaceholder": "Doe",
    "phoneNumber": "Phone Number",
    "phonePlaceholder": "+1 (555) 123-4567",
    "emailAddress": "Email Address",
    "emailPlaceholder": "john.doe@example.com",
    "organization": "Organization",
    "organizationPlaceholder": "Company Name",
    "website": "Website",
    "websitePlaceholder": "https://example.com",
    "clearAllFields": "Clear All Fields",
    "generatedQrCode": "Generated QR Code",
    "scanQrCode": "Scan this QR code with your device",
    "fillFormPrompt": "Fill in the form to generate your QR code",
    "download": "Download",
    "copyData": "Copy Data",
    "copied": "Copied!",
    "qrCodeData": "QR Code Data:",
    "footerText": "Generate QR codes instantly • No data stored • Free to use",
    "qrCodeAlt": "Generated QR Code"
  }
};

const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'tr-TR';
};

const QRCodeGenerator = () => {
  const [locale, setLocale] = useState('tr-TR');
  
  const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['tr-TR'][key] || key;
  
  const [activeTab, setActiveTab] = useState('url');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef(null);
  
  // Form states for different types
  const [urlInput, setUrlInput] = useState('');
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });

  // QR Code generation using QRious library via CDN
  const generateQRCode = async (text) => {
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
      }
      return;
    }

    try {
      // Load QRious library dynamically
      if (!window.QRious) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
        script.onload = () => {
          createQR(text);
        };
        document.head.appendChild(script);
      } else {
        createQR(text);
      }
    } catch (error) {
      console.error('Error loading QR library:', error);
      // Fallback to Google Charts API
      generateFallbackQR(text);
    }
  };

  const createQR = (text) => {
    if (!qrContainerRef.current) return;
    
    try {
      // Clear previous QR code
      qrContainerRef.current.innerHTML = '';
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      qrContainerRef.current.appendChild(canvas);
      
      // Generate QR code
      const qr = new window.QRious({
        element: canvas,
        value: text,
        size: 300,
        background: 'white',
        foreground: 'black',
        level: 'M'
      });
      
      // Style the canvas
      canvas.className = 'w-full h-auto rounded-xl shadow-lg bg-white';
      canvas.style.maxWidth = '300px';
      canvas.style.height = 'auto';
      
    } catch (error) {
      console.error('Error creating QR code:', error);
      generateFallbackQR(text);
    }
  };

  const generateFallbackQR = (text) => {
    if (!qrContainerRef.current) return;
    
    // Clear previous content
    qrContainerRef.current.innerHTML = '';
    
    // Create img element for fallback
    const img = document.createElement('img');
    const encodedData = encodeURIComponent(text);
    img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8`;
    img.alt = t('qrCodeAlt');
    img.className = 'w-full h-auto rounded-xl shadow-lg bg-white p-4';
    img.style.maxWidth = '300px';
    img.style.height = 'auto';
    
    // Add error handling for the fallback image
    img.onerror = () => {
      // If Google Charts also fails, try QR Server API
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
    };
    
    qrContainerRef.current.appendChild(img);
  };

  const formatUrl = (url) => {
    if (!url.trim()) return '';
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const generateVCard = (contact) => {
    // UTF-8 encoding için özel karakterleri destekle
    const encodeVCardText = (text) => {
      return text; // vCard formatı UTF-8'i destekler
    };
    
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${encodeVCardText(contact.firstName)} ${encodeVCardText(contact.lastName)}
N:${encodeVCardText(contact.lastName)};${encodeVCardText(contact.firstName)};;;
ORG:${encodeVCardText(contact.organization)}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
    return vcard;
  };

  useEffect(() => {
    let data = '';
    
    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'contact':
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = '';
    }
    
    setQrData(data);
    generateQRCode(data);
  }, [activeTab, urlInput, contactInfo]);

  const downloadQRCode = () => {
    if (!qrData) return;
    
    const canvas = qrContainerRef.current?.querySelector('canvas');
    const img = qrContainerRef.current?.querySelector('img');
    
    if (canvas) {
      // Download from canvas
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else if (img) {
      // Download from image
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = img.src;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const resetForm = () => {
    setUrlInput('');
    setContactInfo({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: '',
      url: ''
    });
    setQrData('');
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'tr-TR' ? 'en-US' : 'tr-TR';
    setLocale(newLocale);
  };

  const tabs = [
    { id: 'url', label: t('urlTab'), icon: Link },
    { id: 'contact', label: t('contactTab'), icon: User }
  ];

  return (
    <div className="min-h-screen p-4" style={{ background: '#0d0d0d' }}>
      <div className="max-w-4xl mx-auto">
        {/* Language Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl shadow-lg hover:bg-neutral-700 transition-all duration-200 font-medium border border-neutral-700"
            style={{ color: '#fbb80f' }}
          >
            <Globe className="w-4 h-4" />
            {locale === 'tr-TR' ? 'English' : 'Türkçe'}
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ background: '#fbb80f' }}>
            <QrCode className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#fbb80f' }}>
            {t('appTitle')}
          </h1>
          <p className="text-lg" style={{ color: '#d8d8d8' }}>{t('appDescription')}</p>
        </div>

        <div className="rounded-3xl shadow-2xl overflow-hidden border" style={{ background: '#171717', borderColor: '#333333' }}>
          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: '#333333' }}>
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-b-2'
                        : 'hover:bg-neutral-800/50'
                    }`}
                    style={{
                      color: activeTab === tab.id ? '#fbb80f' : '#d8d8d8',
                      borderBottomColor: activeTab === tab.id ? '#fbb80f' : 'transparent',
                      backgroundColor: activeTab === tab.id ? 'rgba(251, 184, 15, 0.1)' : 'transparent'
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#d8d8d8' }}>
                  {activeTab === 'url' && t('enterUrl')}
                  {activeTab === 'contact' && t('contactInformation')}
                </h2>

                {/* URL Input */}
                {activeTab === 'url' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>
                      {t('websiteUrl')}
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={t('urlPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl transition-all duration-200 placeholder-gray-500"
                      style={{ 
                        background: '#1a1a1a',
                        border: '1px solid #333333',
                        color: '#d8d8d8'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#fbb80f'}
                      onBlur={(e) => e.target.style.borderColor = '#333333'}
                    />
                    <p className="text-xs mt-1" style={{ color: '#999999' }}>
                      {t('urlHelp')}
                    </p>
                  </div>
                )}

                {/* Contact Input */}
                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>
                          {t('firstName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.firstName}
                          onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
                          placeholder={t('firstNamePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl transition-all duration-200 placeholder-gray-500"
                          style={{ 
                            background: '#1a1a1a',
                            border: '1px solid #333333',
                            color: '#d8d8d8'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#fbb80f'}
                          onBlur={(e) => e.target.style.borderColor = '#333333'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>
                          {t('lastName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
                          placeholder={t('lastNamePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl transition-all duration-200 placeholder-gray-500"
                          style={{ 
                            background: '#1a1a1a',
                            border: '1px solid #333333',
                            color: '#d8d8d8'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#fbb80f'}
                          onBlur={(e) => e.target.style.borderColor = '#333333'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>
                        {t('phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder={t('phonePlaceholder')}
                        className="w-full px-4 py-3 rounded-xl transition-all duration-200 placeholder-gray-500"
                        style={{ 
                          background: '#1a1a1a',
                          border: '1px solid #333333',
                          color: '#d8d8d8'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#fbb80f'}
                        onBlur={(e) => e.target.style.borderColor = '#333333'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>
                        {t('emailAddress')}
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder={t('emailPlaceholder')}
                        className="w-full px-4 py-3 rounded-xl transition-all duration-200 placeholder-gray-500"
                        style={{ 
                          background: '#1a1a1a',
                          border: '1px solid #333333',
                          color: '#d8d8d8'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#fbb80f'}
                        onBlur={(e) => e.target.style.borderColor = '#333333'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>
                        {t('organization')}
                      </label>
                      <input
                        type="text"
                        value={contactInfo.organization}
                        onChange={(e) => setContactInfo({...contactInfo, organization: e.target.value})}
                        placeholder={t('organizationPlaceholder')}
                        className="w-full px-4 py-3 rounded-xl transition-all duration-200 placeholder-gray-500"
                        style={{ 
                          background: '#1a1a1a',
                          border: '1px solid #333333',
                          color: '#d8d8d8'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#fbb80f'}
                        onBlur={(e) => e.target.style.borderColor = '#333333'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>
                        {t('website')}
                      </label>
                      <input
                        type="url"
                        value={contactInfo.url}
                        onChange={(e) => setContactInfo({...contactInfo, url: e.target.value})}
                        placeholder={t('websitePlaceholder')}
                        className="w-full px-4 py-3 rounded-xl transition-all duration-200 placeholder-gray-500"
                        style={{ 
                          background: '#1a1a1a',
                          border: '1px solid #333333',
                          color: '#d8d8d8'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#fbb80f'}
                        onBlur={(e) => e.target.style.borderColor = '#333333'}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={resetForm}
                  className="w-full px-6 py-3 rounded-xl transition-all duration-200 font-medium border hover:opacity-80"
                  style={{ 
                    background: '#1a1a1a',
                    borderColor: '#333333',
                    color: '#d8d8d8'
                  }}
                >
                  {t('clearAllFields')}
                </button>
              </div>

              {/* QR Code Display Section */}
              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold" style={{ color: '#d8d8d8' }}>{t('generatedQrCode')}</h2>
                
                <div className="rounded-2xl p-8 w-full max-w-sm border" style={{ background: '#0a0a0a', borderColor: '#333333' }}>
                  {qrData ? (
                    <div className="text-center">
                      <div ref={qrContainerRef} className="flex justify-center">
                        {/* QR code will be dynamically inserted here */}
                      </div>
                      <p className="text-sm mt-4" style={{ color: '#999999' }}>
                        {t('scanQrCode')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <QrCode className="w-16 h-16 mx-auto mb-4" style={{ color: '#333333' }} />
                      <p style={{ color: '#999999' }}>
                        {t('fillFormPrompt')}
                      </p>
                    </div>
                  )}
                </div>

                {qrData && (
                  <div className="flex gap-4 w-full max-w-sm">
                    <button
                      onClick={downloadQRCode}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-black rounded-xl transition-all duration-200 font-medium shadow-lg hover:opacity-90"
                      style={{ background: '#fbb80f' }}
                    >
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium border hover:opacity-80"
                      style={{ 
                        background: '#1a1a1a',
                        borderColor: '#333333',
                        color: '#d8d8d8'
                      }}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" style={{ color: '#fbb80f' }} />
                          {t('copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t('copyData')}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {qrData && (
                  <div className="w-full max-w-sm">
                    <h3 className="text-sm font-medium mb-2" style={{ color: '#d8d8d8' }}>{t('qrCodeData')}</h3>
                    <div className="rounded-lg p-3 text-xs max-h-32 overflow-y-auto border" style={{ 
                      background: '#0a0a0a',
                      color: '#999999',
                      borderColor: '#333333'
                    }}>
                      <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm" style={{ color: '#999999' }}>
          <p>{t('footerText')}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
