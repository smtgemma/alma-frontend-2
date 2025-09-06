'use client';

import React from 'react';
import { BsCalendar2Check } from 'react-icons/bs';

export default function SummaryCards() {
  const cards = [
    {
      title: 'Plans Generated',
      value: '12',
      icon: BsCalendar2Check,
    },
    {
      title: 'Plans Completed',
      value: '12',
      icon: BsCalendar2Check,
    },
    {
      title: 'Plans Reviewed',
      value: '12',
      icon: BsCalendar2Check,
    },
    {
      title: 'Plans Pending',
      value: '12',
      icon: BsCalendar2Check,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600 mt-1">{card.title}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <card.icon className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
