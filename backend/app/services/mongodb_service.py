"""MongoDB Service for database connection and operations."""

from __future__ import annotations

import logging
from typing import Any

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger(__name__)


class MongoDBService:
    """Service for managing MongoDB connections and operations."""
    
    def __init__(self, uri: str, database_name: str) -> None:
        """
        Initialize MongoDB service.
        
        Args:
            uri: MongoDB connection URI
            database_name: Name of the database to use
        """
        self.uri = uri
        self.database_name = database_name
        self._client: MongoClient | None = None
        self._database: Database | None = None
    
    def connect(self) -> None:
        """
        Establish connection to MongoDB.
        
        Raises:
            ConnectionFailure: If connection to MongoDB fails
        """
        try:
            self._client = MongoClient(
                self.uri,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
            )
            # Verify connection
            self._client.admin.command("ping")
            self._database = self._client[self.database_name]
            logger.info(f"Connected to MongoDB database: {self.database_name}")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise ConnectionFailure(f"Could not connect to MongoDB: {e}")
    
    def disconnect(self) -> None:
        """Close the MongoDB connection."""
        if self._client:
            self._client.close()
            self._client = None
            self._database = None
            logger.info("Disconnected from MongoDB")
    
    def get_collection(self, collection_name: str) -> Collection:
        """
        Get a MongoDB collection.
        
        Args:
            collection_name: Name of the collection
            
        Returns:
            MongoDB collection object
            
        Raises:
            RuntimeError: If not connected to database
        """
        if self._database is None:
            raise RuntimeError("Not connected to MongoDB. Call connect() first.")
        return self._database[collection_name]
    
    def ping(self) -> bool:
        """
        Check if MongoDB connection is alive.
        
        Returns:
            True if connection is alive, False otherwise
        """
        try:
            if self._client:
                self._client.admin.command("ping")
                return True
        except Exception as e:
            logger.warning(f"MongoDB ping failed: {e}")
        return False
    
    @property
    def is_connected(self) -> bool:
        """Check if service is connected to MongoDB."""
        return self._client is not None and self._database is not None and self.ping()
