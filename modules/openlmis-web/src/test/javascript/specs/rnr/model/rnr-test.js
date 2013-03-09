describe('R&R test', function () {
  xit('should calculate total cost on initialization', function () {
    spyOn(Rnr.prototype, 'init');
//    spyOn2.andCallThrough();
//    spyOn(Rnr.prototype, 'calculateFullSupplyItemsSubmittedCost');
//    spyOn(Rnr.prototype, 'calculateNonFullSupplyItemsSubmittedCost');

    var rnr = Rnr.prototype;

    expect(Rnr.prototype.init).toHaveBeenCalled();
//    expect(Rnr.prototype.calculateFullSupplyItemsSubmittedCost).toHaveBeenCalled();
//    expect(Rnr.prototype.calculateNonFullSupplyItemsSubmittedCost).toHaveBeenCalled();
  });

  it('should prepare line item objects inside rnr', function () {
    var lineItemSpy = spyOn(window, 'RnrLineItem');
    var lineItem1 = {"lineItem":"lineItem1"};
    var lineItem2 = {};

    var rnr = {'fullSupplyLineItems':[lineItem1], 'nonFullSupplyLineItems':[lineItem2], period:{numberOfMonths:5}, status:'status'};
    var constructedRnr = new Rnr(rnr, null);

    expect(lineItemSpy).toHaveBeenCalledWith(lineItem1, 5, null, 'status');
    expect(lineItemSpy.calls.length).toEqual(2);
    expect(constructedRnr.fullSupplyLineItems.length).toEqual(1);
    expect(constructedRnr.nonFullSupplyLineItems.length).toEqual(1);
  });

  it('should set rnrColumns in scope', function () {
    var rnrColumns = [
      {'name':'beginningBalance'}
    ];

    var constructedRnr = new Rnr({}, rnrColumns);

    expect(constructedRnr.programRnrColumnList).toEqual(rnrColumns);
  });

  it('should validate R&R full supply line items and return false if required field missing', function () {
    var lineItem1 = {"lineItem":"lineItem1"};
    var lineItem2 = {};
    var rnr = {period:{numberOfMonths:3}, status:'INITIATED', 'fullSupplyLineItems':[lineItem1, lineItem2]};
    var programRnrColumnList = [
      {"name":"beginningBalance"},
      {"name":"noOfPatients"}
    ];

    rnr = new Rnr(rnr, programRnrColumnList);
    spyOn(rnr.fullSupplyLineItems[0], 'validateRequiredFieldsForFullSupply').andReturn(false);
    spyOn(rnr.fullSupplyLineItems[1], 'validateRequiredFieldsForFullSupply').andReturn(true);

    var errorMessage = rnr.validateFullSupply();

    expect(rnr.fullSupplyLineItems[0].validateRequiredFieldsForFullSupply.calls.length).toEqual(1);
    expect(rnr.fullSupplyLineItems[1].validateRequiredFieldsForFullSupply.calls.length).toEqual(0);
    expect(errorMessage).toEqual('rnr.required.fields.missing.error');
  });

  it('should validate R&R full supply line items and return true if required field is not missing', function () {
    var lineItem1 = {"lineItem":"lineItem1"};
    var lineItem2 = {};
    var rnr = {period:{numberOfMonths:3}, status:'INITIATED', 'fullSupplyLineItems':[lineItem1, lineItem2]};
    var programRnrColumnList = [
      {"name":"beginningBalance"},
      {"name":"noOfPatients"}
    ];

    rnr = new Rnr(rnr, programRnrColumnList);
    spyOn(rnr.fullSupplyLineItems[0], 'validateRequiredFieldsForFullSupply').andReturn(true);
    spyOn(rnr.fullSupplyLineItems[1], 'validateRequiredFieldsForFullSupply').andReturn(true);

    var errorMessage = rnr.validateFullSupply();

    expect(rnr.fullSupplyLineItems[0].validateRequiredFieldsForFullSupply.calls.length).toEqual(1);
    expect(rnr.fullSupplyLineItems[1].validateRequiredFieldsForFullSupply.calls.length).toEqual(1);
    expect(errorMessage).toEqual('');
  });

  it('should validate R&R full supply line items and return false if required field is not missing but arithmetically invalid', function () {
    var lineItem1 = {"lineItem":"lineItem1"};
    var lineItem2 = {};
    var rnr = {period:{numberOfMonths:3}, status:'INITIATED', 'fullSupplyLineItems':[lineItem1, lineItem2]};
    var programRnrColumnList = [
      {"name":"beginningBalance"},
      {"name":"noOfPatients"}
    ];

    rnr = new Rnr(rnr, programRnrColumnList);
    spyOn(rnr.fullSupplyLineItems[0], 'validateRequiredFieldsForFullSupply').andReturn(true);
    spyOn(rnr.fullSupplyLineItems[0], 'formulaValid').andReturn(false);
    spyOn(rnr.fullSupplyLineItems[1], 'validateRequiredFieldsForFullSupply').andReturn(true);
    spyOn(rnr.fullSupplyLineItems[1], 'formulaValid').andReturn(false);


    var errorMessage = rnr.validateFullSupply();

    expect(rnr.fullSupplyLineItems[0].validateRequiredFieldsForFullSupply.calls.length).toEqual(1);
    expect(rnr.fullSupplyLineItems[0].formulaValid.calls.length).toEqual(1);
    expect(rnr.fullSupplyLineItems[1].validateRequiredFieldsForFullSupply.calls.length).toEqual(0);
    expect(rnr.fullSupplyLineItems[1].formulaValid.calls.length).toEqual(0);
    expect(errorMessage).toEqual('rnr.validation.error');
  });

  it('should validate R&R full supply line items and return true if required field is not missing and arithmetically valid', function () {
    var lineItem1 = {"lineItem":"lineItem1"};
    var lineItem2 = {};
    var rnr = {period:{numberOfMonths:3}, status:'INITIATED', 'fullSupplyLineItems':[lineItem1, lineItem2]};
    var programRnrColumnList = [
      {"name":"beginningBalance"},
      {"name":"noOfPatients"}
    ];

    rnr = new Rnr(rnr, programRnrColumnList);
    spyOn(rnr.fullSupplyLineItems[0], 'validateRequiredFieldsForFullSupply').andReturn(true);
    spyOn(rnr.fullSupplyLineItems[0], 'formulaValid').andReturn(true);
    spyOn(rnr.fullSupplyLineItems[1], 'validateRequiredFieldsForFullSupply').andReturn(true);
    spyOn(rnr.fullSupplyLineItems[1], 'formulaValid').andReturn(true);

    var errorMessage = rnr.validateFullSupply();

    expect(rnr.fullSupplyLineItems[0].validateRequiredFieldsForFullSupply.calls.length).toEqual(1);
    expect(rnr.fullSupplyLineItems[0].formulaValid.calls.length).toEqual(1);
    expect(rnr.fullSupplyLineItems[1].validateRequiredFieldsForFullSupply.calls.length).toEqual(1);
    expect(rnr.fullSupplyLineItems[1].formulaValid.calls.length).toEqual(1);
    expect(errorMessage).toEqual('');
  });

  it('should validate R&R non full supply line items and return true if required fields are not missing', function () {
    var lineItem1 = {"lineItem":"lineItem1"};
    var lineItem2 = {};
    var rnr = {period:{numberOfMonths:3}, status:'INITIATED', 'nonFullSupplyLineItems':[lineItem1, lineItem2]};

    var programRnrColumnList = [
      {"name":"quantityRequested"},
      {"name":"reasonForRequestedQuantity"}
    ];
    rnr = new Rnr(rnr, programRnrColumnList);
    spyOn(rnr.nonFullSupplyLineItems[0], 'validateRequiredFieldsForNonFullSupply').andReturn(true);
    spyOn(rnr.nonFullSupplyLineItems[1], 'validateRequiredFieldsForNonFullSupply').andReturn(true);

    var errorMessage = rnr.validateNonFullSupply();

    expect(rnr.nonFullSupplyLineItems[0].validateRequiredFieldsForNonFullSupply.calls.length).toEqual(1);
    expect(rnr.nonFullSupplyLineItems[1].validateRequiredFieldsForNonFullSupply.calls.length).toEqual(1);
    expect(errorMessage).toEqual('');
  });

  it('should validate R&R non full supply line items and return false if required fields are missing', function () {
    var lineItem1 = {"lineItem":"lineItem1"};
    var lineItem2 = {};

    var rnr = {period:{numberOfMonths:3}, status:'INITIATED', 'nonFullSupplyLineItems':[lineItem1, lineItem2]};

    var programRnrColumnList = [
      {"name":"quantityRequested"},
      {"name":"reasonForRequestedQuantity"}
    ];
    rnr = new Rnr(rnr, programRnrColumnList);
    spyOn(rnr.nonFullSupplyLineItems[0], 'validateRequiredFieldsForNonFullSupply').andReturn(false);
    spyOn(rnr.nonFullSupplyLineItems[1], 'validateRequiredFieldsForNonFullSupply').andReturn(true);

    var errorMessage = rnr.validateNonFullSupply();

    expect(rnr.nonFullSupplyLineItems[0].validateRequiredFieldsForNonFullSupply.calls.length).toEqual(1);
    expect(rnr.nonFullSupplyLineItems[1].validateRequiredFieldsForNonFullSupply.calls.length).toEqual(0);
    expect(errorMessage).toEqual('rnr.required.fields.missing.error');
  });

  it('should fill normalized consumption and update cost', function() {
    var rnrLineItem = new RnrLineItem({}, 1, null, 'INITIATED');
    var rnr = new Rnr();
    spyOn(rnrLineItem, 'fillNormalizedConsumption');
    spyOn(rnr, 'fillCost');

    rnr.fillNormalizedConsumption(rnrLineItem);

    expect(rnrLineItem.fillNormalizedConsumption).toHaveBeenCalled();
    expect(rnr.fillCost).toHaveBeenCalled();
  });

  it('should fill Consumption Or StockInHand and update cost', function() {
    var rnrLineItem = new RnrLineItem({}, 1, null, 'INITIATED');
    var rnr = new Rnr();
    spyOn(rnrLineItem, 'fillConsumptionOrStockInHand');
    spyOn(rnr, 'fillCost');

    rnr.fillConsumptionOrStockInHand(rnrLineItem);

    expect(rnrLineItem.fillConsumptionOrStockInHand).toHaveBeenCalled();
    expect(rnr.fillCost).toHaveBeenCalled();
  });

  it('should fill packs to ship based on quantity requested or calculated quantity and update cost', function() {
    var rnrLineItem = new RnrLineItem({}, 1, null, 'INITIATED');
    var rnr = new Rnr();
    spyOn(rnrLineItem, 'fillPacksToShip');
    spyOn(rnr, 'fillCost');

    rnr.fillPacksToShip(rnrLineItem);

    expect(rnrLineItem.fillPacksToShip).toHaveBeenCalled();
    expect(rnr.fillCost).toHaveBeenCalled();
  });

  describe('Calculate Total Cost For Rnr', function () {
    it('should calculate fullSupplyItemsSubmittedCost', function () {
      var rnr = new Rnr();

      var rnrLineItem1 = new RnrLineItem({"productCode":"p1"}, 2, null, 'INITIATED');
      rnrLineItem1.cost = 100;
      var rnrLineItem2 = new RnrLineItem({"productCode":"p2"}, 2, null, 'INITIATED');
      rnrLineItem2.cost = 60;
      var rnrLineItem3 = new RnrLineItem({"productCode":"p3"}, 2, null, 'INITIATED');
      rnrLineItem3.cost = 160;

      rnr.fullSupplyLineItems = new Array(rnrLineItem1, rnrLineItem2, rnrLineItem3);

      rnr.calculateFullSupplyItemsSubmittedCost();

      expect(rnr.fullSupplyItemsSubmittedCost).toEqual('320.00');
    });

    it('should calculate nonFullSupplyItemsSubmittedCost', function () {
      var rnr = new Rnr();

      var rnrLineItem1 = new RnrLineItem({"productCode":"p1"}, 2, null, 'INITIATED');
      rnrLineItem1.cost = 100;
      var rnrLineItem2 = new RnrLineItem({"productCode":"p2"}, 2, null, 'INITIATED');
      rnrLineItem2.cost = 60;
      var rnrLineItem3 = new RnrLineItem({"productCode":"p3"}, 2, null, 'INITIATED');
      rnrLineItem3.cost = 160;

      rnr.nonFullSupplyLineItems = new Array(rnrLineItem1, rnrLineItem2, rnrLineItem3);

      rnr.calculateNonFullSupplyItemsSubmittedCost();

      expect(rnr.nonFullSupplyItemsSubmittedCost).toEqual('320.00');
    });

    it('should update cost for full supply line items', function () {
      var rnr = new Rnr();
      spyOn(rnr, 'calculateFullSupplyItemsSubmittedCost');

      rnr.fillCost(true);

      expect(rnr.calculateFullSupplyItemsSubmittedCost).toHaveBeenCalled();
    });

    it('should update cost for non-full supply line items', function () {
      var rnr = new Rnr();
      spyOn(rnr, 'calculateNonFullSupplyItemsSubmittedCost');

      rnr.fillCost(false);

      expect(rnr.calculateNonFullSupplyItemsSubmittedCost).toHaveBeenCalled();
    });
  });
});

