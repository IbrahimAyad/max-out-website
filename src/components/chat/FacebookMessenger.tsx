'use client'

import { useEffect } from 'react'
import { initializeMessengerChat } from '@/lib/analytics/facebook-pixel'

interface FacebookMessengerProps {
  pageId?: string;
  themeColor?: string;
  greetingMessage?: string;
}

export function FacebookMessenger({ 
  pageId = '100063560717417', // Replace with your Facebook Page ID
  themeColor = '#D4AF37', // Gold color to match brand
  greetingMessage = 'Hi! How can we help you find the perfect outfit?'
}: FacebookMessengerProps) {
  useEffect(() => {
    // Only load in production
    if (process.env.NODE_ENV !== 'production') {

      return;
    }

    // Initialize Facebook SDK if not already loaded
    if (!window.FB) {
      window.fbAsyncInit = function() {
        window.FB.init({
          xfbml: true,
          version: 'v18.0'
        });
      };

      // Load Facebook SDK
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    // Clean up any existing chat plugin
    const existingChat = document.querySelector('.fb-customerchat');
    if (existingChat) {
      existingChat.remove();
    }

    // Add the chat plugin after a delay to ensure SDK is loaded
    setTimeout(() => {
      const chatDiv = document.createElement('div');
      chatDiv.className = 'fb-customerchat';
      chatDiv.setAttribute('page_id', pageId);
      chatDiv.setAttribute('theme_color', themeColor);
      chatDiv.setAttribute('logged_in_greeting', greetingMessage);
      chatDiv.setAttribute('logged_out_greeting', greetingMessage);
      chatDiv.setAttribute('greeting_dialog_display', 'fade');
      chatDiv.setAttribute('greeting_dialog_delay', '4');
      document.body.appendChild(chatDiv);

      // Parse the new element
      if (window.FB && window.FB.XFBML) {
        window.FB.XFBML.parse();
      }
    }, 2000);

    return () => {
      // Cleanup on unmount
      const chatPlugin = document.querySelector('.fb-customerchat');
      if (chatPlugin) {
        chatPlugin.remove();
      }
    };
  }, [pageId, themeColor, greetingMessage]);

  return null;
}