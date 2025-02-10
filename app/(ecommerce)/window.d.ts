interface Window {
    adroll_adv_id?: string;
    adroll_pix_id?: string;
    adroll_version?: string;
    adroll?: {
      track: (event: string) => void;
      [key: string]: any;
    };
    __adroll_loaded?: boolean;
  }