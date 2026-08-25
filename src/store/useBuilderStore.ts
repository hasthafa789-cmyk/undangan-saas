import { create } from 'zustand'

interface BuilderState {
  groomName: string;
  brideName: string;
  eventDate: string;
  galleryImage: string;
  theme: string; // <-- [BARU] Menyimpan pilihan tema
  setField: (field: string, value: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  groomName: 'Nama Pria',
  brideName: 'Nama Wanita',
  eventDate: '',
  galleryImage: '',
  theme: 'classic', // <-- [BARU] Tema awal
  
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
}))