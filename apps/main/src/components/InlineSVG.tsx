"use client";

import React from 'react';

interface InlineSVGProps {
  svg: string;
  className?: string;
}

const InlineSVG = ({ svg, className }: InlineSVGProps) => {
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default InlineSVG;
