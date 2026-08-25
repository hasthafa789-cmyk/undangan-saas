import { create } from 'zustand'

interface BuilderState {
  groomName: string;
  brideName: string;
  eventDate: string;
  galleryImage: string; // <-- [BARU] Tempat menyimpan foto
  setField: (field: string, value: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  groomName: 'Nama Pria',
  brideName: 'Nama Wanita',
  eventDate: '',
  galleryImage: '', // <-- [BARU] Awalnya kosong
  
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
}))