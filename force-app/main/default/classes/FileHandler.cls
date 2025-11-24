public with sharing class FileHandler {
    
    @AuraEnabled
    public static void FileHandler(string records) {

        List<Map<String, String>> recordsList = (List<Map<String, String>>) JSON.deserialize(records, List<Map<String, String>>.class);

        AsyncFileHandler asyncFileHandler = new AsyncFileHandler(recordsList);
        System.enqueueJob(asyncFileHandler);

    }
}