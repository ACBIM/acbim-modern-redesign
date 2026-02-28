import React from 'react';

interface LogoProps {
  scrolled: boolean;
}

const Logo: React.FC<LogoProps> = ({ scrolled }) => {
  const dynamicColorClass = scrolled ? 'text-slate-900' : 'text-white';
  
  return (
    <div className="flex items-center transition-transform duration-300 ease-in-out hover:scale-105" aria-label="ACBIM Home">
      <svg
        height="70"
        className={`transition-colors duration-300 ${dynamicColorClass}`}
        viewBox="0 0 850.55 762.6"
        role="img"
        aria-labelledby="title"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="title">ACBIM</title>
        <defs>
          <style>{`
            .uuid-5ecbd79f-6756-47fd-8001-f6bbb57e133d { fill: #ee7527; }
            .uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d { fill: currentColor; }
            .uuid-5ecbd79f-6756-47fd-8001-f6bbb57e133d, .uuid-39c0072e-fcf6-4225-b2b2-8e0e51680fbc, .uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d { stroke-width: 0px; }
            .uuid-39c0072e-fcf6-4225-b2b2-8e0e51680fbc { fill: none; }
            .uuid-edf2ae3a-1ba7-404e-a8d7-22e502762c41 { clip-path: url(#uuid-ac8b0459-289f-4d28-9920-94877714638c); }
            .uuid-2ed55d7f-7d72-4d8b-a320-d1d288b0e9f7 { clip-path: url(#uuid-7fbb0b1f-ed01-4dc4-90a5-81b7c88dffc8); }
            .uuid-a38a0faa-a77b-432b-a156-1f7ad25ea10c { clip-path: url(#uuid-d6d9dc7e-f69a-4542-a0f7-f9093e4898f7); }
            .uuid-7a7b5656-6a11-45d9-bbcd-a8507402248a { clip-path: url(#uuid-3cbc3187-c01e-4000-bb7f-f9cca7f77f7f); }
            .uuid-8cc4dc43-5103-4478-b365-25adb97ccb5e { clip-path: url(#uuid-5136b5ba-2d3e-4c97-ae05-e54a77e2b11c); }
          `}</style>
          <clipPath id="uuid-7fbb0b1f-ed01-4dc4-90a5-81b7c88dffc8">
            <path className="uuid-39c0072e-fcf6-4225-b2b2-8e0e51680fbc" d="M642.91,363.91c0,39.74-32.21,71.96-71.96,71.96s-71.96-32.22-71.96-71.96,32.21-71.96,71.96-71.96,71.96,32.23,71.96,71.96" />
          </clipPath>
          <clipPath id="uuid-d6d9dc7e-f69a-4542-a0f7-f9093e4898f7">
            <rect className="uuid-39c0072e-fcf6-4225-b2b2-8e0e51680fbc" x="608.14" y="196.1" width="237.4" height="185.92" />
          </clipPath>
          <clipPath id="uuid-3cbc3187-c01e-4000-bb7f-f9cca7f77f7f">
            <rect className="uuid-39c0072e-fcf6-4225-b2b2-8e0e51680fbc" x="608.14" y="382.02" width="237.4" height="185.92" />
          </clipPath>
          <clipPath id="uuid-ac8b0459-289f-4d28-9920-94877714638c">
            <rect className="uuid-39c0072e-fcf6-4225-b2b2-8e0e51680fbc" x="370.74" y="196.1" width="237.4" height="185.92" />
          </clipPath>
          <clipPath id="uuid-5136b5ba-2d3e-4c97-ae05-e54a77e2b11c">
            <rect className="uuid-39c0072e-fcf6-4225-b2b2-8e0e51680fbc" x="370.74" y="382.02" width="237.4" height="185.92" />
          </clipPath>
        </defs>
        <path className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" d="M541.1,502.03c6.18-2.86,7.84-8.46,7.84-13.88,0-13.67-11.63-19.98-25.9-19.98h-36.52v71.4h36.81c13.05-.1,27.67-4.9,27.67-20.91,0-6.42-3.29-13.05-9.89-16.63ZM506.38,484.49h16.34c3.99,0,6.22,2.44,6.22,5.61s-2.24,5.3-6.44,5.3h-16.12v-10.91ZM523.41,523.86h-17.03v-13.56h17.03c5.03,0,7.56,2.96,7.56,6.82s-2.45,6.74-7.56,6.74Z" />
        <rect className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" x="562.93" y="468.17" width="20.12" height="71.4" />
        <polygon className="uuid-5ecbd79f-6756-47fd-8001-f6bbb57e133d" points="119.81 511.03 207.31 511.03 163.56 399.11 119.81 511.03" />
        <polygon className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" points="678.24 468.17 657.24 468.17 657.23 468.17 638.46 492.33 627.61 478.33 627.58 478.36 619.67 468.17 598.57 468.17 598.57 539.57 598.58 539.57 618.57 539.57 618.59 539.57 618.59 497.16 636.4 518.66 636.41 518.66 640 518.66 640.01 518.66 658.19 497.11 658.24 497.06 658.24 503.62 658.24 518.33 658.24 525.58 658.26 525.58 658.26 539.57 678.24 539.57 678.24 525.58 678.25 525.58 678.25 498.74 678.25 479.82 678.25 473 678.25 471.5 678.25 468.17 678.24 468.17" />
        <polygon className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" points="214.89 207.19 207.26 207.19 158.31 207.19 157.23 207.19 122.9 222.28 122.91 222.28 0 559.72 7.39 559.72 129.49 222.28 152.38 222.28 180.7 222.28 214.89 207.19" />
        <path className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" d="M412.18,224.79c1.71,0,3.4.07,5.08.16l41.16-18.32c-1.42-.07-2.84-.13-4.29-.13-42.41,0-77.06,10.54-104.37,27.8,18.37-6.07,39.13-9.51,62.43-9.51Z" />
        <polygon className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" points="222.85 216.64 187.31 232.51 306.52 559.71 341.94 544.07 222.85 216.64" />
        <polygon className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" points="464.84 275.34 464.84 215.04 422.19 234.03 422.19 293.59 464.84 275.34" />
        <path className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" d="M414.1,479.44l42.42-18.88c-.79.03-1.62.09-2.39.09-65.96,0-88.82-31.39-89.36-75.14-.28-30.32,11.81-65.05,40.7-83.53-55.3,3.55-77.22,50.84-76.85,90.2.51,40.91,21.88,87.33,83.56,87.33.62,0,1.29-.05,1.92-.07Z" />
        <polygon className="uuid-b0613039-c198-4a59-88fc-d2afc02fcd2d" points="422.16 487.84 421.9 559.72 464.54 540.89 464.8 468.86 422.16 487.84" />
      </svg>
    </div>
  );
};

export default Logo;