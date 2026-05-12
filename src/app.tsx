import { useState } from 'preact/hooks';
import './app.css';
import ChangeColors from './components/ChangeColors';

export function App() {


  return (
    <div className="container mx-auto">
      <ChangeColors />
    </div>
  )
}
