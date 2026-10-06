export interface ProvinceInfo {
  code: string;
  name: string;
  nameSi: string;
  nameTa: string;
  districts: string[];
}

export interface DistrictInfo {
  name: string;
  nameSi: string;
  nameTa: string;
  provinceCode: string;
  provinceName: string;
}

