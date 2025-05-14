'use client'
import React from 'react';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const {t} = useTranslation();
  return (
    <footer className="bg-[#343a40] text-white p-[20px] mt-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-left justify-between">
          <div className="flex-grow ">
            <h5 className="text-white"> {t('footer.contact.email')}</h5>
            <p className="text-white"> {t('footer.contact.email')}</p>
          </div>
          <div className="flex-grow">
            <h5>{t('footer.address.title')}</h5>
            <p>{t('footer.address.details')}</p>
          </div>
          <div className="flex-grow">
            <h5>{t('footer.policies.title')}</h5>
            <ul className="list-none p-0">
              <li><a href="/politica-privacidad" className="text-white no-underline">
                {t('footer.policies.privacy')}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-center">
          <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
