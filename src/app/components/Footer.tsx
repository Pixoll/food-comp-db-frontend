"use client";

import { useTranslation } from "@/context/I18nContext";
import type { JSX } from "react";

export default function Footer(): JSX.Element {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#343a40] text-white py-3">
      <div className="container mx-auto px-5">
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-wrap items-start justify-between">
            <div className="grow min-w-50 text-white">
              <h5 className="font-semibold mb-1">{t.footer.contact.title}</h5>
              <p className="text-sm text-[#d1d5db]">
                {t.footer.contact.email}
                <a href="mailto:contacto@capchical.com" className="hover:underline">
                  contacto@capchical.com
                </a>
              </p>
            </div>
            {/*<div className="grow text-[white]">*/}
            {/*  <h5 className="text-[14px] font-semibold mb-1">{t.footer.address.title}</h5>*/}
            {/*  <p className="text-[12px] text-[#d1d5db]">{t.footer.address.details}</p>*/}
            {/*</div>*/}
            {/*<div className="grow min-w-50 text-[white]">*/}
            {/*  <h5 className="text-[14px] font-semibold mb-1">{t.footer.policies.title}</h5>*/}
            {/*  <ul className="list-none p-0">*/}
            {/*    <li>*/}
            {/*      <a*/}
            {/*        href="/politica-privacidad"*/}
            {/*        className="text-[12px] text-[#d1d5db] hover:text-[white] transition-colors no-underline"*/}
            {/*      >*/}
            {/*        {t.footer.policies.privacy}*/}
            {/*      </a>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</div>*/}
          </div>

          <div className="border-t border-[#6b7280] pt-2 mt-3">
            <div className="text-center text-white">
              <p className="text-sm text-[#d1d5db]">
                <a href="https://db.capchical.com/" className="text-white hover:underline">
                  {t.footer.copyright.title}
                </a>
                {" "} © 2024-2026 {t.footer.copyright.by}{" "}
                <a href="https://capchical.com/" className="text-white hover:underline">
                  CapChiCAL
                </a>
                {" "}{t.footer.copyright.licensedUnder}{" "}
                <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" className="text-white hover:underline">
                  CC BY-NC-ND 4.0
                </a>
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                  alt=""
                  className="inline size-4 ml-1"
                />
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                  alt=""
                  className="inline size-4 ml-1"
                />
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
                  alt=""
                  className="inline size-4 ml-1"
                />
                <img
                  src="https://mirrors.creativecommons.org/presskit/icons/nd.svg"
                  alt=""
                  className="inline size-4 ml-1"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
