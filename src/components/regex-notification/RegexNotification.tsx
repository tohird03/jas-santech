import './regex-notification.scss';

import React from 'react';

export const RegexNotification = () => (
  <div className="regex-notification_wrapper">
    <p className="regex-notification_textTop">
        Siz faqat ushbu harf va belgilardan foydalana olasiz:
      <span className="regex-notification_textBottom"> A-Z a-z 0-9 `</span>
    </p>
  </div>
);
