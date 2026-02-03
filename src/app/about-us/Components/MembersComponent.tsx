'use client';

import {type JSX, useState} from "react";
import {ChevronLeft, ChevronRight, User} from "lucide-react";
import Image from "next/image";
import styles from "./MembersComponent.module.css";

export type Member = {
  name: string,
  institution: string,
  position: string,
  email: string,
  photoUrl?: string
}

export function MemberCard(prop: Member): JSX.Element {
  return (
    <div className={styles.memberCard}>
      <div className={styles.cardContent}>
        <div className={styles.photoContainer}>
          {prop.photoUrl ? (
            <Image
              src={prop.photoUrl}
              alt={`Foto de ${prop.name}`}
              fill
              className={styles.photo}
              sizes="120px"
            />
          ) : (
            <div className={styles.photoPlaceholder}>
              <User className={styles.userIcon} />
            </div>
          )}
        </div>

        <div className={styles.infoContainer}>
          <h3 className={styles.memberName}>{prop.name}</h3>
          <p className={styles.memberPosition}>{prop.position}</p>
          <p className={styles.memberInstitution}>{prop.institution}</p>
          <a href={`mailto:${prop.email}`} className={styles.memberEmail}>
            {prop.email}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MembersComponent(props: {members: Array<Member>}): JSX.Element {
  const [index, setIndex] = useState<number>(0);

  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? props.members.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex === props.members.length - 1 ? 0 : prevIndex + 1));
  };

  if (props.members.length === 0) {
    return <div className={styles.noMembers}>No hay miembros disponibles</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Nuestro Equipo</h2>

      <div className={styles.sliderWrapper}>
        <button
          onClick={handlePrevious}
          disabled={props.members.length <= 1}
          className={styles.navButton}
          aria-label="Miembro anterior"
        >
          <ChevronLeft className={styles.icon} />
        </button>

        <div className={styles.sliderContainer}>
          <div className={styles.slider} style={{ transform: `translateX(-${index * 100}%)` }}>
            {props.members.map((member, idx) => (
              <div key={idx} className={styles.slide}>
                <MemberCard
                  email={member.email}
                  name={member.name}
                  institution={member.institution}
                  position={member.position}
                  photoUrl={member.photoUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={props.members.length <= 1}
          className={styles.navButton}
          aria-label="Siguiente miembro"
        >
          <ChevronRight className={styles.icon} />
        </button>
      </div>

      {props.members.length > 1 && (
        <div className={styles.indicators}>
          {props.members.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`${styles.dot} ${idx === index ? styles.activeDot : ''}`}
              aria-label={`Ir al miembro ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <p className={styles.counter}>
        {index + 1} / {props.members.length}
      </p>
    </div>
  );
}