'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import EnhancedFilterPanel from './EnhancedFilterPanel';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  facets: any;
  isFilterActive: (key: string, value: any) => boolean;
  toggleFilter: (key: string, value: any) => void;
  updateFilters: (filters: any) => void;
  resetFilters: () => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  facets,
  isFilterActive,
  toggleFilter,
  updateFilters,
  resetFilters
}: MobileFilterDrawerProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <EnhancedFilterPanel
                      filters={filters}
                      facets={facets}
                      isFilterActive={isFilterActive}
                      toggleFilter={toggleFilter}
                      updateFilters={updateFilters}
                      resetFilters={resetFilters}
                      onClose={onClose}
                      variant="sidebar"
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}