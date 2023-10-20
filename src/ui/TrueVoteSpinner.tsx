/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
export const TrueVoteSpinner = () => (
  <svg width='154' height='154' viewBox='0 0 38 38' xmlns='http://www.w3.org/2000/svg'>
    <g fill='none' fillRule='evenodd'>
      <g transform='translate(1 1)' strokeWidth='2'>
        <image xlinkHref='/static/TrueVote_Logo.svg' x='0' y='0' width='36' height='36'>
          <animateTransform
            attributeName='transform'
            type='rotate'
            from='0 18 18'
            to='360 18 18'
            dur='1s'
            repeatCount='indefinite'
          />
        </image>
      </g>
    </g>
  </svg>
);
