"""MongoDB-based persistence service for analysis records."""

from __future__ import annotations

import logging
from typing import Any

from pymongo.errors import PyMongoError

from app.models.analysis import AnalysisRecord
from app.services.mongodb_service import MongoDBService

logger = logging.getLogger(__name__)


class MongoDBAnalysisPersistenceService:
    """Service for persisting analysis records to MongoDB."""
    
    COLLECTION_NAME = "analyses"
    
    def __init__(self, mongodb_service: MongoDBService) -> None:
        """
        Initialize MongoDB analysis persistence service.
        
        Args:
            mongodb_service: MongoDB service instance
        """
        self.mongodb_service = mongodb_service
        self._ensure_indexes()
    
    def _ensure_indexes(self) -> None:
        """Create indexes for the analyses collection."""
        if self.mongodb_service._database is None:
            return
        
        try:
            collection = self.mongodb_service.get_collection(self.COLLECTION_NAME)
            # Create index on analysis_id for fast lookups
            collection.create_index("analysis_id", unique=True)
            # Create index on timestamp for sorting
            collection.create_index("timestamp")
            logger.info("MongoDB indexes created successfully")
        except PyMongoError as e:
            logger.warning(f"Failed to create indexes: {e}")
    
    def save_analysis(self, analysis: AnalysisRecord) -> AnalysisRecord:
        """
        Save an analysis record to MongoDB.
        
        Args:
            analysis: Analysis record to save
            
        Returns:
            The saved analysis record
            
        Raises:
            RuntimeError: If save operation fails
        """
        try:
            collection = self.mongodb_service.get_collection(self.COLLECTION_NAME)
            document = analysis.model_dump()
            
            # Use upsert to handle duplicates gracefully
            collection.update_one(
                {"analysis_id": analysis.analysis_id},
                {"$set": document},
                upsert=True,
            )
            
            logger.info(f"Saved analysis: {analysis.analysis_id}")
            return analysis
            
        except PyMongoError as e:
            logger.error(f"Failed to save analysis: {e}")
            raise RuntimeError(f"Could not save analysis to MongoDB: {e}")
    
    def list_analyses(self) -> list[AnalysisRecord]:
        """
        Retrieve all analysis records from MongoDB.
        
        Returns:
            List of analysis records, sorted by timestamp (newest first)
            
        Raises:
            RuntimeError: If retrieval fails
        """
        try:
            collection = self.mongodb_service.get_collection(self.COLLECTION_NAME)
            
            # Retrieve all documents, sorted by timestamp descending
            cursor = collection.find().sort("timestamp", -1)
            
            analyses = []
            for document in cursor:
                # Remove MongoDB's _id field
                document.pop("_id", None)
                
                try:
                    analysis = AnalysisRecord.model_validate(document)
                    analyses.append(analysis)
                except Exception as e:
                    logger.warning(f"Skipping invalid analysis document: {e}")
                    continue
            
            logger.info(f"Retrieved {len(analyses)} analyses from MongoDB")
            return analyses
            
        except PyMongoError as e:
            logger.error(f"Failed to retrieve analyses: {e}")
            raise RuntimeError(f"Could not retrieve analyses from MongoDB: {e}")
    
    def get_analysis(self, analysis_id: str) -> AnalysisRecord | None:
        """
        Retrieve a specific analysis by ID.
        
        Args:
            analysis_id: ID of the analysis to retrieve
            
        Returns:
            Analysis record if found, None otherwise
            
        Raises:
            RuntimeError: If retrieval fails
        """
        try:
            collection = self.mongodb_service.get_collection(self.COLLECTION_NAME)
            document = collection.find_one({"analysis_id": analysis_id})
            
            if not document:
                return None
            
            # Remove MongoDB's _id field
            document.pop("_id", None)
            
            analysis = AnalysisRecord.model_validate(document)
            logger.info(f"Retrieved analysis: {analysis_id}")
            return analysis
            
        except PyMongoError as e:
            logger.error(f"Failed to retrieve analysis: {e}")
            raise RuntimeError(f"Could not retrieve analysis from MongoDB: {e}")
    
    def delete_analysis(self, analysis_id: str) -> bool:
        """
        Delete an analysis record from MongoDB.
        
        Args:
            analysis_id: ID of the analysis to delete
            
        Returns:
            True if deleted, False if not found
            
        Raises:
            RuntimeError: If deletion fails
        """
        try:
            collection = self.mongodb_service.get_collection(self.COLLECTION_NAME)
            result = collection.delete_one({"analysis_id": analysis_id})
            
            if result.deleted_count > 0:
                logger.info(f"Deleted analysis: {analysis_id}")
                return True
            return False
            
        except PyMongoError as e:
            logger.error(f"Failed to delete analysis: {e}")
            raise RuntimeError(f"Could not delete analysis from MongoDB: {e}")
    
    def count_analyses(self) -> int:
        """
        Get the total count of analyses in the database.
        
        Returns:
            Number of analyses
            
        Raises:
            RuntimeError: If count fails
        """
        try:
            collection = self.mongodb_service.get_collection(self.COLLECTION_NAME)
            count = collection.count_documents({})
            return count
            
        except PyMongoError as e:
            logger.error(f"Failed to count analyses: {e}")
            raise RuntimeError(f"Could not count analyses in MongoDB: {e}")
