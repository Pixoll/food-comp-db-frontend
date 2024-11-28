import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const {t} = useTranslation("global");
  return (
    <footer style={{ backgroundColor: '#343a40', color: 'white', padding: '20px', marginTop: '0' }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5> {t('footer.contact.title')}</h5>
            <p> {t('footer.contact.email')}</p>
          </Col>
          <Col md={4}>
            <h5>{t('footer.address.title')}</h5>
            <p>{t('footer.address.details')}</p>
          </Col>
          <Col md={4}>
            <h5>{t('footer.policies.title')}</h5>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><a href="/politica-privacidad" style={{ color: 'white', textDecoration: 'none' }}>{t('footer.policies.privacy')}</a></li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12} className="text-center">
            <p>{t('footer.copyright')}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
