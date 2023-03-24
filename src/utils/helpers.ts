// GEG	Enkel glas	 0,20 
// GDO	Glas dubbel standaard	 0,33 
// GHR+	Glas HR+	 0,60 
// GH++	Glas HR++	 1,00 
// SMO	Spouwmuur ongeisoleerd 	 0,40 

export type CurrentInsulation = {
   id: number;
   code: string;
   name: string;
   rc: number;
}

export const CurrentInsulationArray: CurrentInsulation[] = [
   {
      id: 1,
      code: "GEG",
      name: "Enkel glas",
      rc: 0.2
   },
   {
      id: 2,
      code: "GDO",
      name: "Glas dubbel standaard",
      rc: 0.33
   },
   {
      id: 3,
      code: "GHR+",
      name: "Glas HR+",
      rc: 0.6
   },
   {
      id: 4,
      code: "GH++",
      name: "Glas HR++",
      rc: 1
   },
   {
      id: 5,
      code: "SMO",
      name: "Spouwmuur ongeisoleerd",
      rc: 0.4
   }
];

// V++	Vervanging Glas HR++	 1,00 	 -   	250
// VVG	Vervanging door vacuum glas	 2,00 	 -   	500
// mis	Muurisolatie schuim	 1,20 	 1,00 	28
// MI6	Muurisolatie 6cm	 1,40 	 1,00 	30

export type NewInsulation = {
   id: number;
   code: string;
   name: string;
   rc: number;
   ipv: number;
   cost: number;
}

export const NewInsulationArray: NewInsulation[] = [
   {
      id: 1,
      code: "V++",
      name: "Glas HR++ ",
      rc: 1,
      ipv: 0,
      cost: 250
   },
   {
      id: 2,
      code: "VVG",
      name: "Glas Vacuum",
      rc: 2,
      ipv: 0,
      cost: 500
   },
   {
      id: 3,
      code: "mis",
      name: "Muurisolatie Schuim",
      rc: 1.2,
      ipv: 1,
      cost: 28
   },
   {
      id: 4,
      code: "MI6",
      name: "Muurisolatie 6cm",
      rc: 1.4,
      ipv: 1,
      cost: 30
   }
];
