const data = [
  { id: '1016', name: 'Apple Pte Ltd', date: '2023/07/01', amount:'3617.15', status: 'PAID', action:'' },
  { id: '1015', name: 'Floppy Pte Ltd', date: '2023/06/03', amount:'492.90', status: 'OVERDUE', action:'' },
  { id: '1014', name: 'Zebra Pte Ltd', date: '2023/06/19', amount:'853.23', status: 'PAID', action:'' },
  { id: '1013', name: 'Banana Cha Ptd Ltd', date: '2023/06/13', amount:'1242.74', status: 'PAID', action:'' },
  { id: '1012', name: 'Piong Cha Ptd Ltd', date: '2023/07/03', amount:'362.40', status: 'DRAFT', action:'' },
  { id: '1011', name: 'Crayon Cha Ptd Ltd', date: '2023/05/14', amount:'162.82', status: 'OVERDUE', action:'' },
  { id: '1010', name: 'Doggo Pte Ltd', date: '2022/06/19', amount:'2590.00', status: 'DRAFT', action:'' },
  { id: '1008', name: 'Plant Cha Ptd Ltd', date: '2022/12/14', amount:'653.84', status: 'PAID', action:'' },
  { id: '1002', name: 'Water Ptd Ltd', date: '2023/02/05', amount:'254.40', status: 'DRAFT', action:'' },
  { id: '1001', name: 'Watch Cha Ptd Ltd', date: '2022/06/14', amount:'1127.32', status: 'OVERDUE', action:'' },
  { id: '1017', name: 'Apple Pte Ltd', date: '2023/07/01', amount:'3617.15', status: 'UNPAID', action:'' },
  { id: '1018', name: 'Floppy Pte Ltd', date: '2023/07/03', amount:'492.90', status: 'OVERDUE', action:'' },
  { id: '1019', name: 'Zebra Pte Ltd', date: '2023/07/19', amount:'853.23', status: 'UNPAID', action:'' },
  { id: '1023', name: 'Banana Cha Ptd Ltd', date: '2023/07/13', amount:'1242.74', status: 'UNPAID', action:'' },
  { id: '1022', name: 'Piong Cha Ptd Ltd', date: '2023/07/03', amount:'362.40', status: 'DRAFT', action:'' },
  { id: '1021', name: 'Crayon Cha Ptd Ltd', date: '2023/07/14', amount:'162.82', status: 'OVERDUE', action:'' },
  { id: '1020', name: 'Doggo Pte Ltd', date: '2022/07/19', amount:'2590.00', status: 'DRAFT', action:'' },
  { id: '1028', name: 'Plant Cha Ptd Ltd', date: '2022/12/14', amount:'653.84', status: 'PAID', action:'' },
  { id: '1032', name: 'Water Ptd Ltd', date: '2023/02/05', amount:'254.40', status: 'DRAFT', action:'' },
  { id: '1041', name: 'Watch Cha Ptd Ltd', date: '2022/06/14', amount:'1127.32', status: 'OVERDUE', action:'' },
  { id: '1024', name: 'Orange Pte Ltd', date: '2023/07/02', amount:'1721.50', status: 'PAID', action:'' },
  { id: '1025', name: 'Giraffe Pte Ltd', date: '2023/07/08', amount:'412.80', status: 'PAID', action:'' },
  { id: '1026', name: 'Elephant Cha Ptd Ltd', date: '2023/07/09', amount:'732.15', status: 'OVERDUE', action:'' },
  { id: '1027', name: 'Tiger Pte Ltd', date: '2023/07/11', amount:'1355.20', status: 'UNPAID', action:'' },
  { id: '1029', name: 'Lion Cha Ptd Ltd', date: '2023/07/17', amount:'981.40', status: 'DRAFT', action:'' },
  { id: '1030', name: 'Panda Pte Ltd', date: '2023/06/30', amount:'576.90', status: 'UNPAID', action:'' },
  { id: '1031', name: 'Kangaroo Pte Ltd', date: '2023/06/22', amount:'964.75', status: 'PAID', action:'' },
  { id: '1033', name: 'Koala Cha Ptd Ltd', date: '2023/07/04', amount:'281.60', status: 'OVERDUE', action:'' },
  { id: '1034', name: 'Monkey Pte Ltd', date: '2023/07/06', amount:'1763.45', status: 'PAID', action:'' },
  { id: '1035', name: 'Gorilla Cha Ptd Ltd', date: '2023/07/15', amount:'862.30', status: 'UNPAID', action:'' },
  { id: '1036', name: 'Rhino Pte Ltd', date: '2023/07/21', amount:'1235.80', status: 'DRAFT', action:'' },
  { id: '1037', name: 'Penguin Cha Ptd Ltd', date: '2023/06/29', amount:'537.60', status: 'PAID', action:'' },
  { id: '1038', name: 'Lizard Pte Ltd', date: '2023/07/25', amount:'930.25', status: 'OVERDUE', action:'' },
  { id: '1039', name: 'Koala Cha Ptd Ltd', date: '2023/07/10', amount:'672.35', status: 'PAID', action:'' }
];

function updateInvoiceStatus(id, status) {
  const invoice = data.find(row => row.id === id);
  if (invoice) {
    invoice.status = status;
  }
}

export { data, updateInvoiceStatus };