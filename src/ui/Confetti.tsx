import classes from '@/ui/shell/AppStyles.module.css';
import { random } from 'lodash';
import React from 'react';

export const ConfettiExplosion: React.FC = () => {
  const confettiImages: React.ReactNode[] = [];

  for (let i: number = 0; i < 100; i++) {
    const left: string = random(0, window.innerWidth) + 'px';
    const top: string = random(0, window.innerHeight) + 'px';
    const randomSize: string = random(20, 150) + 'px'; // Randomize width between 50-100px
    const animationDuration: any = random(1, 3) + 's'; // Randomize animation duration between 1 and 3 seconds
    const animationDelay: any = 0.1 * Math.random() * 10; // Calculate random animation delay

    const confettiImageStyle: React.CSSProperties = {
      left,
      top,
      width: randomSize,
      height: randomSize,
    };

    const confettiImage: any = (
      <div
        className={classes.confettiImage}
        style={{ ...confettiImageStyle, animationDuration, animationDelay }}
        key={i}
      >
        <img className={classes.confettiImage__logo} />
      </div>
    );
    confettiImages.push(confettiImage);
  }

  return (
    <div id='confettiContainer' className='confettiContainer'>
      {confettiImages}
    </div>
  );
};
