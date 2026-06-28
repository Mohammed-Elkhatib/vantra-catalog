export interface Dimensions {
  width_in?: number;
  height_in?: number;
  depth_in?: number;
  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  diameter_in?: number;
}

export interface Performance {
  airflow_cfm?: number;
  airflow_cmh?: number;
  pressure_drop_in_wg?: number;
  media_area_sqft?: number;
  velocity_fpm?: number;
}

export interface Variant {
  model_reference: string;
  sku?: string;
  dimensions?: Dimensions;
  performance?: Performance;
  specifications_override?: Partial<ProductSpecification>;
}

export interface Certification {
  body?: string;
  abbreviation: string;
  standard?: string;
  listing_number?: string;
  type?: 'classified' | 'listed' | 'certified' | 'member';
}

export interface Document {
  type: 'technical_data_sheet' | 'catalog' | 'installation_guide' | 'selection_chart' | 'cad_drawing' | 'bim_file' | 'test_report';
  title: string;
  url: string;
  file_size_kb?: number;
  language?: string;
}

export interface FilterSpec {
  spec_type: 'filter';
  filter_classification_en1822?: 'E10' | 'E11' | 'E12' | 'H13' | 'H14' | 'U15' | 'U16' | 'U17';
  merv_rating?: number;
  mpps_efficiency_pct?: number;
  efficiency_at_0_3_micron_pct?: number;
  filter_media?: string;
  media_separator?: string;
  frame_material?: string;
  media_sealant?: string;
  gasket_type?: string;
  construction_type?: 'deep_pleat' | 'mini_pleat' | 'v_cell' | 'bag' | 'panel' | 'rigid_cell' | 'pad' | 'roll';
  max_temperature_f?: number;
  max_temperature_c?: number;
  final_pressure_drop_in_wg?: number;
  scan_tested?: boolean;
}

export interface DamperSpec {
  spec_type: 'damper';
  damper_function: 'fire' | 'smoke' | 'fire_smoke' | 'curtain' | 'volume_control' | 'pressure_relief';
  fire_rating_hours?: 1.5 | 3;
  blade_type?: 'v_lock' | 'airfoil' | 'parallel' | 'opposed';
  leakage_class?: 'I' | 'II' | 'III';
  system_type?: 'static' | 'dynamic' | 'both';
  actuation?: 'motorized' | 'spring' | 'motorized_spring' | 'cable';
  construction_material?: 'galvanized_steel' | 'stainless_steel';
  velocity_rating_fpm_min?: number;
  velocity_rating_fpm_max?: number;
  pressure_rating_wg_min?: number;
  pressure_rating_wg_max?: number;
  temperature_rating_f?: number;
  shape?: 'rectangular' | 'round';
  style?: string;
}

export interface SoundAttenuatorSpec {
  spec_type: 'sound_attenuator';
  attenuator_type: 'rectangular' | 'rectangular_hp' | 'tubular' | 'crosstalk' | 'bend_vertical' | 'bend_horizontal' | 'acoustic_splitter';
  casing_material?: 'galvanized_steel' | 'ss_304' | 'ss_316' | 'aluminium_3003';
  casing_thickness_mm?: number;
  insulation_type?: string;
  insulation_density_kg_m3?: number;
  facing?: 'perforated_steel' | 'melinex' | 'none';
  facing_thickness_mm?: number;
  operating_temp_min_c?: number;
  operating_temp_max_c?: number;
  max_airway_velocity_m_s?: number;
  insertion_loss_db?: {
    '63hz'?: number;
    '125hz'?: number;
    '250hz'?: number;
    '500hz'?: number;
    '1000hz'?: number;
    '2000hz'?: number;
    '4000hz'?: number;
    '8000hz'?: number;
  };
  flange_size_mm?: string;
  max_section_dimensions_mm?: {
    width?: number;
    height?: number;
    length?: number;
  };
}

export interface CoatingSpec {
  spec_type: 'coating';
  product_function: 'duct_coating' | 'vapour_barrier' | 'adhesive' | 'sealant' | 'foam_glue' | 'anti_fungal';
  base_material?: string;
  colour?: string;
  density_gm_cc?: number;
  viscosity_cps?: string;
  solid_content_pct?: number;
  specific_gravity?: number;
  service_temp_min_c?: number;
  service_temp_max_c?: number;
  application_temp_min_c?: number;
  application_temp_max_c?: number;
  flash_point?: string;
  voc_content_g_l?: number;
  drying_time_touch_hours?: number;
  drying_time_thorough_hours?: number;
  coverage_rate?: string;
  shelf_life_months?: number;
  water_resistance?: 'excellent' | 'good' | 'moderate';
  chemical_resistance?: 'excellent' | 'good' | 'moderate';
  flame_spread_index?: number;
  smoke_developed_index?: number;
  application_method?: string[];
  packing?: string;
}

export type ProductSpecification =
  | FilterSpec
  | DamperSpec
  | SoundAttenuatorSpec
  | CoatingSpec;

export interface Product {
  id: string; // URL slug
  brand_id: string;
  name: string;
  product_type:
    | 'pre_filter' | 'fine_filter' | 'hepa_filter' | 'carbon_filter'
    | 'housing_filter' | 'media_roll'
    | 'fire_damper' | 'smoke_damper' | 'fire_smoke_damper'
    | 'curtain_damper' | 'sound_attenuator'
    | 'coating' | 'adhesive' | 'sealant';
  category:
    | 'Air Filters'
    | 'Air Outlets & Accessories'
    | 'Dampers'
    | 'Sound Attenuators'
    | 'Coatings Adhesives & Sealants';
  subcategory?: string;
  description?: string;
  features?: string[];
  applications?: (
    | 'Hospital' | 'Pharmaceutical' | 'Biomedical' | 'Laboratory'
    | 'Food Processing' | 'Hospitality' | 'Commercial HVAC'
    | 'Industrial' | 'Clean Room' | 'Operating Theatre'
  )[];
  specifications: ProductSpecification;
  variants?: Variant[];
  certifications?: Certification[];
  documents?: Document[];
  images?: {
    url: string;
    alt?: string;
    type: 'hero' | 'thumbnail' | 'technical_drawing';
  }[];
  model_numbering_scheme?: {
    pattern: string;
    segments: {
      code: string;
      meaning: string;
    }[];
  };
  // Internal provenance/verification notes. Never rendered in the UI; carried
  // through to a future CMS import. `representative_pending_tds` flags products
  // whose individual datasheet was not in the source set (specs unverified).
  metadata?: {
    catalog_year?: number;
    source_pdf?: string;
    last_verified?: string;
    verification_status?: 'source_verified' | 'representative_pending_tds';
    notes?: string;
  };
}
