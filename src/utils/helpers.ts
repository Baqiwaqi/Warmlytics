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
   rVerb: number;
   unknown: number;
   cost: number;
}

export const NewInsulationArray: NewInsulation[] = [
   {
      id: 1,
      code: "V++",
      name: "Glas HR++ ",
      rVerb: 1,
      unknown: 0,
      cost: 250
   },
   {
      id: 2,
      code: "VVG",
      name: "Glas Vacuum",
      rVerb: 2,
      unknown: 0,
      cost: 500
   },
   {
      id: 3,
      code: "mis",
      name: "Muurisolatie Schuim",
      rVerb: 1.2,
      unknown: 1,
      cost: 28
   },
   {
      id: 4,
      code: "MI6",
      name: "Muurisolatie 6cm",
      rVerb: 1.4,
      unknown: 1,
      cost: 30
   }
];
