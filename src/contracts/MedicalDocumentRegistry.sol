
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedicalDocumentRegistry
 * @dev This contract manages medical document hashes and access controls
 */
contract MedicalDocumentRegistry {
    struct Document {
        string documentHash;
        string documentType;
        uint256 timestamp;
        bool exists;
    }
    
    struct AccessControl {
        address patient;
        address provider;
        string documentHash;
        bool hasAccess;
    }
    
    // Mapping from patient address to their document hashes
    mapping(address => string[]) private patientToDocuments;
    
    // Mapping from document hash to document details
    mapping(string => Document) private documentDetails;
    
    // Mapping to track which provider has access to which patient's document
    mapping(address => mapping(address => mapping(string => bool))) private accessControl;
    
    // Events
    event DocumentRegistered(address indexed patient, string documentHash, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed provider, string documentHash);
    event AccessRevoked(address indexed patient, address indexed provider, string documentHash);
    
    /**
     * @dev Register a new document hash
     * @param documentHash Hash of the document
     * @param documentType Type of the document (e.g., "image/jpeg", "application/pdf")
     * @param timestamp Timestamp when the document was created
     */
    function registerDocument(string memory documentHash, string memory documentType, uint256 timestamp) external {
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        require(!documentDetails[documentHash].exists, "Document already registered");
        
        // Store document details
        documentDetails[documentHash] = Document({
            documentHash: documentHash,
            documentType: documentType,
            timestamp: timestamp,
            exists: true
        });
        
        // Add document hash to patient's documents
        patientToDocuments[msg.sender].push(documentHash);
        
        emit DocumentRegistered(msg.sender, documentHash, timestamp);
    }
    
    /**
     * @dev Grant access to a specific document to a provider
     * @param provider Address of the healthcare provider
     * @param documentHash Hash of the document to grant access to
     */
    function grantAccess(address provider, string memory documentHash) external {
        require(provider != address(0), "Invalid provider address");
        require(documentDetails[documentHash].exists, "Document does not exist");
        
        // Verify document belongs to the patient (caller)
        bool isDocumentOwner = false;
        string[] memory documents = patientToDocuments[msg.sender];
        for (uint256 i = 0; i < documents.length; i++) {
            if (keccak256(abi.encodePacked(documents[i])) == keccak256(abi.encodePacked(documentHash))) {
                isDocumentOwner = true;
                break;
            }
        }
        require(isDocumentOwner, "You do not own this document");
        
        // Grant access
        accessControl[provider][msg.sender][documentHash] = true;
        
        emit AccessGranted(msg.sender, provider, documentHash);
    }
    
    /**
     * @dev Revoke access to a specific document from a provider
     * @param provider Address of the healthcare provider
     * @param documentHash Hash of the document to revoke access from
     */
    function revokeAccess(address provider, string memory documentHash) external {
        require(provider != address(0), "Invalid provider address");
        
        // Verify document belongs to the patient (caller)
        bool isDocumentOwner = false;
        string[] memory documents = patientToDocuments[msg.sender];
        for (uint256 i = 0; i < documents.length; i++) {
            if (keccak256(abi.encodePacked(documents[i])) == keccak256(abi.encodePacked(documentHash))) {
                isDocumentOwner = true;
                break;
            }
        }
        require(isDocumentOwner, "You do not own this document");
        
        // Revoke access
        accessControl[provider][msg.sender][documentHash] = false;
        
        emit AccessRevoked(msg.sender, provider, documentHash);
    }
    
    /**
     * @dev Check if a provider has access to a specific document
     * @param provider Address of the healthcare provider
     * @param patient Address of the patient
     * @param documentHash Hash of the document
     * @return bool True if provider has access, false otherwise
     */
    function hasAccess(address provider, address patient, string memory documentHash) external view returns (bool) {
        return accessControl[provider][patient][documentHash];
    }
    
    /**
     * @dev Get all documents registered by a patient
     * @param patient Address of the patient
     * @return string[] Array of document hashes
     */
    function getPatientDocuments(address patient) external view returns (string[] memory) {
        return patientToDocuments[patient];
    }
    
    /**
     * @dev Get document details
     * @param documentHash Hash of the document
     * @return Document struct with document details
     */
    function getDocumentDetails(string memory documentHash) external view returns (Document memory) {
        require(documentDetails[documentHash].exists, "Document does not exist");
        return documentDetails[documentHash];
    }
    
    /**
     * @dev Get all documents a provider has access to for a specific patient
     * @param provider Address of the healthcare provider
     * @param patient Address of the patient
     * @return string[] Array of document hashes
     */
    function getAccessibleDocuments(address provider, address patient) external view returns (string[] memory) {
        string[] memory allDocuments = patientToDocuments[patient];
        uint256 accessCount = 0;
        
        // First count how many documents provider has access to
        for (uint256 i = 0; i < allDocuments.length; i++) {
            if (accessControl[provider][patient][allDocuments[i]]) {
                accessCount++;
            }
        }
        
        // Create array of accessible documents
        string[] memory accessibleDocs = new string[](accessCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allDocuments.length; i++) {
            if (accessControl[provider][patient][allDocuments[i]]) {
                accessibleDocs[currentIndex] = allDocuments[i];
                currentIndex++;
            }
        }
        
        return accessibleDocs;
    }
}
