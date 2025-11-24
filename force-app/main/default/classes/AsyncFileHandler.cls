public with sharing class AsyncFileHandler implements Queueable {

    public List<Map<String, String>> records;

    public AsyncFileHandler(List<Map<String, String>> records) {
        this.records = records;
    }

    public void execute(QueueableContext context) {

        
        Set<String> fileFields = new Set<String>();
        for (Map<String, String> record : records) {
            fileFields.addAll(record.keySet());
        }

       
        Map<String, SObjectField> fieldMap = Account.SObjectType.getDescribe().fields.getMap();


        Set<String> validFields = new Set<String>();
        for (String field : fileFields) {
            if (fieldMap.containsKey(field)) {
                validFields.add(field);
            }
        }

      
        List<Account> accounts = new List<Account>();

        for (Map<String, String> row : records) {
            Account acc = new Account();

            for (String field : row.keySet()) {

                if (validFields.contains(field)) {
                    String rawValue = row.get(field);

                    if (String.isBlank(rawValue)) continue;

                    SObjectField sobjField = fieldMap.get(field);
                    Schema.DescribeFieldResult dfr = sobjField.getDescribe();
                    Schema.DisplayType type = dfr.getType();

                    Object finalValue;

                    switch on type {
                        when Date {
                            finalValue = Date.valueOf(rawValue);
                        }
                        when Datetime {
                            finalValue = DateTime.valueOf(rawValue);
                        }
                        when Boolean {
                            finalValue = (rawValue.toLowerCase() == 'true');
                        }
                        when Integer {
                            finalValue = Integer.valueOf(rawValue);
                        }
                        when Double {
                            finalValue = Double.valueOf(rawValue);
                        }
                        when Currency {
                            finalValue = Decimal.valueOf(rawValue);
                        }
                        when Percent {
                            finalValue = Decimal.valueOf(rawValue);
                        }
                        when Long {
                            finalValue = Long.valueOf(rawValue);
                        }
                        when else {
                            finalValue = rawValue;
                        }
                    }


                    acc.put(field, finalValue);
                }
            }

            accounts.add(acc);
        }

        if (!accounts.isEmpty()) {
            insert accounts;
        }
    }
}
