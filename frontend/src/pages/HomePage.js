import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Header, Main } from '../components/layout';
import CitySearchForm from '../components/forms/CitySearchForm';
import MapView from '../components/common/MapView';
import CarrierList from '../components/common/CarrierList';
import { useCarrierSearch } from '../hooks';

const HomePage = () => {
  const {
    carriers,
    isLoading,
    error,
    route,
    searchCarriers,
  } = useCarrierSearch();

  return (
    <div className="App">
      <Header />
      <Main>
        <CitySearchForm onSearch={searchCarriers} isLoading={isLoading} />
        <MapView from={route.from} to={route.to} />
        <CarrierList carriers={carriers} />
      </Main>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: 'var(--color-gray-900)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-gray-200)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success-600)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error-600)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
};

export default HomePage;
