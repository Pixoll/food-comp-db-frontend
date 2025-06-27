'use client'
import React from 'react';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const {t} = useTranslation();
  return (
    <footer className="bg-[#343a40] text-[white] pb-[4px] max-h-[200px]">
      <div className="container mx-auto px-[20px]">
        <div className="flex flex-wrap items-left justify-between">
          <div className="flex-grow text-[white]">
            <h5 className=""> {t('footer.contact.email')}</h5>
            <p className=""> {t('footer.contact.email')}</p>
          </div>
          <div className="flex-grow text-[white]">
            <h5>{t('footer.address.title')}</h5>
            <p>{t('footer.address.details')}</p>
          </div>
          <div className="flex-grow text-[white]">
            <h5>{t('footer.policies.title')}</h5>
            <ul className="list-none p-0">
              <li><a href="/politica-privacidad" className="text-[white] no-underline">
                {t('footer.policies.privacy')}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-[12px]">
          <div className="text-center text-[white]">
          <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
